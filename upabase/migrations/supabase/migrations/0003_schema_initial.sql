-- =====================================================================
-- MAISON XERXES, migration 0003
-- Politiques RLS.
--
-- Principe general : la cle anonyme lit le catalogue et rien d autre.
-- Un client authentifie lit ce qui lui appartient. Personne n ecrit
-- jamais depuis le navigateur ; toute ecriture passe par la cle de
-- service, cote serveur.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Identite du client courant
--
-- security definer, car la fonction doit pouvoir lire clients avant que
-- la politique sur clients ne s applique. Elle ne renvoie jamais que la
-- ligne de l appelant.
-- ---------------------------------------------------------------------

create or replace function public.mon_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.clients c
  where c.user_id = (select auth.uid())
  limit 1;
$$;

grant execute on function public.mon_client_id() to authenticated;
revoke execute on function public.mon_client_id() from anon, public;


-- ---------------------------------------------------------------------
-- 2. CATALOGUE, lecture publique
-- ---------------------------------------------------------------------

create policy "Modeles actifs visibles publiquement"
  on public.modeles for select
  to anon, authenticated
  using (actif = true);

create policy "Variantes actives visibles publiquement"
  on public.variantes for select
  to anon, authenticated
  using (
    actif = true
    and exists (
      select 1 from public.modeles m
      where m.id = variantes.modele_id and m.actif = true
    )
  );

-- Les drops en preparation restent invisibles. Un drop devient public
-- au moment ou son statut quitte 'planifie'.
create policy "Drops annonces visibles publiquement"
  on public.drops for select
  to anon, authenticated
  using (statut <> 'planifie');


-- ---------------------------------------------------------------------
-- 3. CLIENTS, chacun sa ligne
-- ---------------------------------------------------------------------

create policy "Un client lit sa fiche"
  on public.clients for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Un client corrige sa fiche"
  on public.clients for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));


-- ---------------------------------------------------------------------
-- 4. COMMANDES ET CONTENU, lecture par le proprietaire
-- ---------------------------------------------------------------------

create policy "Un client lit ses commandes"
  on public.commandes for select
  to authenticated
  using (client_id = public.mon_client_id());

create policy "Un client lit ses groupes"
  on public.groupes for select
  to authenticated
  using (
    exists (
      select 1 from public.commandes c
      where c.id = groupes.commande_id
        and c.client_id = public.mon_client_id()
    )
  );

create policy "Un client lit ses lignes"
  on public.lignes_commande for select
  to authenticated
  using (
    exists (
      select 1 from public.commandes c
      where c.id = lignes_commande.commande_id
        and c.client_id = public.mon_client_id()
    )
  );


-- ---------------------------------------------------------------------
-- 5. REGISTRE, ferme au public, ouvert au porteur
-- ---------------------------------------------------------------------

create policy "Un porteur lit le numero de sa piece"
  on public.numeros_edition for select
  to authenticated
  using (
    groupe_id is not null
    and exists (
      select 1
      from public.groupes g
      join public.commandes c on c.id = g.commande_id
      where g.id = numeros_edition.groupe_id
        and c.client_id = public.mon_client_id()
    )
  );

-- series et evenements_stripe ne recoivent aucune politique.
-- RLS activee sans politique signifie : inaccessible, sauf cle de service.
revoke all on public.evenements_stripe from anon, authenticated;
revoke all on public.series from anon, authenticated;


-- ---------------------------------------------------------------------
-- 6. La vue doit respecter RLS
--
-- Sans security_invoker, une vue s execute avec les droits de son
-- proprietaire et contourne silencieusement les politiques des tables
-- qu elle interroge. C est le piege classique de PostgreSQL.
-- ---------------------------------------------------------------------

alter view public.v_numeros_affichage set (security_invoker = on);

-- La vue lit series, qui est fermee. Elle ne renverra donc rien tant que
-- series reste sans politique. Reservee a la cle de service pour l instant.
revoke all on public.v_numeros_affichage from anon, authenticated;


-- ---------------------------------------------------------------------
-- 7. Aucune ecriture depuis le navigateur
--
-- Rappel explicite, sous forme de revocation, de ce que l absence de
-- politique d insertion garantit deja.
-- ---------------------------------------------------------------------

revoke insert, update, delete on public.commandes       from anon, authenticated;
revoke insert, update, delete on public.groupes         from anon, authenticated;
revoke insert, update, delete on public.lignes_commande from anon, authenticated;
revoke insert, update, delete on public.numeros_edition from anon, authenticated;
revoke insert, update, delete on public.modeles         from anon, authenticated;
revoke insert, update, delete on public.variantes       from anon, authenticated;
revoke insert, update, delete on public.drops           from anon, authenticated;
revoke insert, delete         on public.clients         from anon, authenticated;
