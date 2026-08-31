-- =====================================================================
-- MAISON XERXES, schema initial
-- A executer dans Supabase Studio, section SQL Editor, en une seule fois.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Utilitaire de mise a jour automatique des horodatages
-- ---------------------------------------------------------------------

create or replace function public.touch_maj_le()
returns trigger
language plpgsql
as $$
begin
  new.maj_le = now();
  return new;
end;
$$;


-- ---------------------------------------------------------------------
-- 1. CATALOGUE
-- ---------------------------------------------------------------------

create table public.modeles (
  id          uuid primary key default gen_random_uuid(),
  reference   text not null unique,
  nom         text not null,
  categorie   text not null check (categorie in ('bague', 'bracelet')),
  ordre       integer not null default 0,
  actif       boolean not null default true,
  cree_le     timestamptz not null default now()
);

comment on table public.modeles is
  'Les six modeles de la maison. La reference est l identifiant technique stable, le nom est l affichage.';


create table public.variantes (
  id                  uuid primary key default gen_random_uuid(),
  modele_id           uuid not null references public.modeles(id) on delete restrict,
  matiere             text not null check (matiere in ('argent_925', 'vermeil')),
  taille              text,
  prix_cents          integer not null check (prix_cents > 0),
  actif               boolean not null default true,
  cree_le             timestamptz not null default now()
);

create unique index variantes_unicite
  on public.variantes (modele_id, matiere, coalesce(taille, ''));

create index variantes_modele_idx on public.variantes (modele_id);

comment on table public.variantes is
  'Declinaison vendable d un modele. Le prix vit ici, jamais sur le modele.';


-- ---------------------------------------------------------------------
-- 2. DROPS
-- ---------------------------------------------------------------------

create table public.drops (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  ouverture   timestamptz not null,
  fermeture   timestamptz not null,
  statut      text not null default 'planifie'
              check (statut in ('planifie', 'ouvert', 'ferme', 'en_production', 'livre')),
  cree_le     timestamptz not null default now(),
  constraint drops_fenetre_coherente check (fermeture > ouverture)
);


-- ---------------------------------------------------------------------
-- 3. CLIENTS
-- ---------------------------------------------------------------------

create table public.clients (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid unique references auth.users(id) on delete set null,
  email               text not null,
  prenom              text,
  nom                 text,
  telephone           text,
  stripe_customer_id  text unique,
  cree_le             timestamptz not null default now(),
  maj_le              timestamptz not null default now()
);

create unique index clients_email_unicite on public.clients (lower(email));

create trigger clients_touch
  before update on public.clients
  for each row execute function public.touch_maj_le();

comment on column public.clients.user_id is
  'Nul pour une commande invite. Rattachable plus tard si le client ouvre un compte avec le meme courriel.';


-- ---------------------------------------------------------------------
-- 4. COMMANDES
-- ---------------------------------------------------------------------

create sequence public.commandes_reference_seq start 1;

create table public.commandes (
  id                          uuid primary key default gen_random_uuid(),
  reference                   text not null unique
                              default 'XRX-' || to_char(now(), 'YYYY') || '-' ||
                                      lpad(nextval('public.commandes_reference_seq')::text, 4, '0'),
  client_id                   uuid not null references public.clients(id) on delete restrict,
  drop_id                     uuid references public.drops(id) on delete set null,
  statut                      text not null default 'en_attente_paiement'
                              check (statut in ('en_attente_paiement', 'payee', 'en_production',
                                                'expediee', 'livree', 'annulee', 'remboursee')),
  devise                      text not null default 'CHF',
  montant_total_cents         integer not null default 0 check (montant_total_cents >= 0),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text unique,
  adresse_livraison           jsonb,
  note_interne                text,
  payee_le                    timestamptz,
  cree_le                     timestamptz not null default now(),
  maj_le                      timestamptz not null default now()
);

create index commandes_client_idx on public.commandes (client_id);
create index commandes_statut_idx on public.commandes (statut);
create index commandes_drop_idx   on public.commandes (drop_id);

create trigger commandes_touch
  before update on public.commandes
  for each row execute function public.touch_maj_le();


create table public.duos (
  id           uuid primary key default gen_random_uuid(),
  commande_id  uuid not null references public.commandes(id) on delete cascade,
  cree_le      timestamptz not null default now()
);

create index duos_commande_idx on public.duos (commande_id);

comment on table public.duos is
  'Regroupe deux lignes d une meme commande destinees a porter le meme numero grave.';


create table public.lignes_commande (
  id                   uuid primary key default gen_random_uuid(),
  commande_id          uuid not null references public.commandes(id) on delete cascade,
  variante_id          uuid not null references public.variantes(id) on delete restrict,
  duo_id               uuid references public.duos(id) on delete set null,
  quantite             integer not null default 1 check (quantite >= 1),
  prix_unitaire_cents  integer not null check (prix_unitaire_cents >= 0),
  cree_le              timestamptz not null default now(),
  constraint ligne_duo_unitaire check (duo_id is null or quantite = 1)
);

create index lignes_commande_commande_idx on public.lignes_commande (commande_id);
create index lignes_commande_duo_idx      on public.lignes_commande (duo_id);


-- ---------------------------------------------------------------------
-- 5. REGISTRE DES NUMEROS GRAVES
-- ---------------------------------------------------------------------

create table public.numeros_edition (
  id                 uuid primary key default gen_random_uuid(),
  modele_id          uuid not null references public.modeles(id) on delete restrict,
  numero             integer not null check (numero > 0),
  ligne_commande_id  uuid references public.lignes_commande(id) on delete restrict,
  duo_id             uuid references public.duos(id) on delete set null,
  statut             text not null default 'attribue'
                     check (statut in ('attribue', 'grave', 'expedie', 'annule')),
  attribue_le        timestamptz not null default now(),
  grave_le           timestamptz,
  constraint numeros_edition_unicite unique (modele_id, numero)
);

create index numeros_edition_ligne_idx  on public.numeros_edition (ligne_commande_id);
create index numeros_edition_modele_idx on public.numeros_edition (modele_id, numero);

comment on table public.numeros_edition is
  'Une ligne par piece physique. La contrainte d unicite est la garantie qu un numero ne peut etre grave deux fois sur un meme modele.';


-- ---------------------------------------------------------------------
-- 6. IDEMPOTENCE STRIPE
-- ---------------------------------------------------------------------

create table public.evenements_stripe (
  id         text primary key,
  type       text not null,
  charge     jsonb,
  recu_le    timestamptz not null default now(),
  traite_le  timestamptz
);

comment on table public.evenements_stripe is
  'Stripe rejoue ses webhooks. L identifiant d evenement sert de cle d idempotence.';


-- ---------------------------------------------------------------------
-- 7. ATTRIBUTION DES NUMEROS
--
-- Regle : chaque modele possede sa propre serie. Un duo prend le premier
-- numero libre dans les deux series a la fois, ce qui cree des trous dans
-- la serie la moins avancee. Ces trous sont volontaires et definitifs.
--
-- A n appeler qu apres confirmation du paiement.
-- ---------------------------------------------------------------------

create or replace function public.attribuer_numeros(p_commande_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duo      record;
  v_ligne    record;
  v_numero   integer;
  v_compteur integer := 0;
  i          integer;
begin
  -- Idempotence : si la commande porte deja des numeros, ne rien faire.
  if exists (
    select 1
    from numeros_edition n
    join lignes_commande lc on lc.id = n.ligne_commande_id
    where lc.commande_id = p_commande_id
  ) then
    return 0;
  end if;

  -- Serialisation des attributions concurrentes.
  perform pg_advisory_xact_lock(hashtext('numeros_edition')::bigint);

  -- 7a. Les duos d abord, pour qu ils prennent les numeros les plus bas possibles.
  for v_duo in
    select d.id as duo_id
    from duos d
    where d.commande_id = p_commande_id
    order by d.cree_le
  loop
    select coalesce(max(n.numero), 0) + 1
      into v_numero
      from numeros_edition n
     where n.modele_id in (
       select v.modele_id
       from lignes_commande lc
       join variantes v on v.id = lc.variante_id
       where lc.duo_id = v_duo.duo_id
     );

    insert into numeros_edition (modele_id, numero, ligne_commande_id, duo_id)
    select v.modele_id, v_numero, lc.id, v_duo.duo_id
    from lignes_commande lc
    join variantes v on v.id = lc.variante_id
    where lc.duo_id = v_duo.duo_id;

    v_compteur := v_compteur + 1;
  end loop;

  -- 7b. Les pieces vendues seules.
  for v_ligne in
    select lc.id, v.modele_id, lc.quantite
    from lignes_commande lc
    join variantes v on v.id = lc.variante_id
    where lc.commande_id = p_commande_id
      and lc.duo_id is null
    order by lc.cree_le
  loop
    for i in 1..v_ligne.quantite loop
      select coalesce(max(n.numero), 0) + 1
        into v_numero
        from numeros_edition n
       where n.modele_id = v_ligne.modele_id;

      insert into numeros_edition (modele_id, numero, ligne_commande_id)
      values (v_ligne.modele_id, v_numero, v_ligne.id);

      v_compteur := v_compteur + 1;
    end loop;
  end loop;

  return v_compteur;
end;
$$;

-- Seule la cle service_role, utilisee par le webhook, peut appeler cette fonction.
revoke all on function public.attribuer_numeros(uuid) from public, anon, authenticated;


-- ---------------------------------------------------------------------
-- 8. VERROUILLAGE
--
-- RLS activee partout, sans aucune politique. Consequence voulue : la cle
-- publique du site ne lit et n ecrit rien tant que les politiques de
-- l etape suivante ne sont pas ecrites. Seule la cle service_role passe.
-- ---------------------------------------------------------------------

alter table public.modeles           enable row level security;
alter table public.variantes         enable row level security;
alter table public.drops             enable row level security;
alter table public.clients           enable row level security;
alter table public.commandes         enable row level security;
alter table public.duos              enable row level security;
alter table public.lignes_commande   enable row level security;
alter table public.numeros_edition   enable row level security;
alter table public.evenements_stripe enable row level security;


-- ---------------------------------------------------------------------
-- 9. AMORCE DU CATALOGUE
-- Les variantes et les prix restent a saisir.
-- ---------------------------------------------------------------------

insert into public.modeles (reference, nom, categorie, ordre) values
  ('aphrodite', 'Aphrodite', 'bague',    1),
  ('gaia',      'Gaia',      'bague',    2),
  ('eos',       'Eos',       'bague',    3),
  ('cephale',   'Cephale',   'bracelet', 4),
  ('achille',   'Achille',   'bracelet', 5),
  ('heracles',  'Heracles',  'bracelet', 6);

-- Les accents des noms affiches sont a retablir depuis Studio apres verification
-- de l encodage, ou directement dans le front. Le champ reference reste sans accent.
