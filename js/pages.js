// ─── pages.js ───
// Rendu des pages statiques (sans etat partage ni animation) et leurs handlers
// de formulaire associes.

    function renderMaison() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="maison-view animate-in">
          <h1 class="maison-hero-title">Xerxès</h1>
          <div class="maison-divider"></div>

          <section class="maison-chapter maison-chapter--split">
            <div class="maison-chapter-split-text">
              <h2 class="maison-chapter-title">L'histoire</h2>
              <p class="maison-chapter-body">Xerxès régna sur le plus vaste empire que l'Antiquité ait connu; des rives de l'Indus aux côtes de la Grèce. Son nom seul convoque la démesure, l'armée innombrable, la flotte entière, le pont jeté sur la mer pour que rien ne lui résiste. On ne suivait pas Xerxès; on le servait, ou on le craignait. Ce nom porte encore, aujourd'hui, ce que peu de noms portent; la mémoire d'une puissance absolue.</p>
            </div>
            <div class="maison-chapter-split-media" aria-hidden="true">
              <span class="maison-chapter-split-media-label">Image à venir</span>
            </div>
          </section>

          <div class="maison-inline-media-wrap">
            <div class="maison-inline-media">
              <div class="maison-inline-media-caption">
                <span class="maison-inline-media-title">L'atelier</span>
                <button type="button" class="xs-lien">Découvrir<span class="xs-lien-trait"></span></button>
              </div>
            </div>
          </div>

          <div class="maison-duo-wrap">
            <h2 class="maison-duo-title">Le duo</h2>
            <div class="maison-duo-grid">
              <div class="maison-duo-media" aria-hidden="true">
                <span class="maison-chapter-split-media-label">Image à venir</span>
              </div>
              <div class="maison-duo-media" aria-hidden="true">
                <span class="maison-chapter-split-media-label">Image à venir</span>
              </div>
            </div>
            <p class="maison-duo-text">Chaque pièce Xerxès existe en deux exemplaires, jamais un seul; une bague, un bracelet, un même numéro d'édition gravé sur les deux. L'une se porte ici; l'autre, ailleurs, portée par une autre personne, liée à la première par un même moment ou une même épreuve traversée ensemble. La pièce n'est pas un bijou; c'est une preuve, celle qu'on n'a pas avancé seul.</p>
          </div>

          <section class="maison-chapter maison-chapter--split maison-chapter--split-gap">
            <div class="maison-chapter-split-media" aria-hidden="true">
              <span class="maison-chapter-split-media-label">Image à venir</span>
            </div>
            <div class="maison-chapter-split-text">
              <h2 class="maison-chapter-title">Une édition limitée</h2>
              <p class="maison-chapter-body">L'édition limitée n'est pas ici une rareté commerciale; c'est une appartenance. Ceux qui portent Xerxès se reconnaissent, sans un mot, à un détail que seuls les initiés savent lire. On n'achète pas une place dans ce cercle; on y est admis, par la pièce elle-même et par celui ou celle qui la porte avec vous.</p>
            </div>
          </section>

          <div class="maison-materiaux-wrap">
            <h2 class="maison-materiaux-title">Matériaux</h2>
            <div class="maison-materiaux-grid">
              <div class="maison-materiaux-media maison-materiaux-media--petit" aria-hidden="true">
                <span class="maison-chapter-split-media-label">Image à venir</span>
              </div>
              <div class="maison-materiaux-media maison-materiaux-media--grand" aria-hidden="true">
                <span class="maison-chapter-split-media-label">Image à venir</span>
              </div>
            </div>
            <button type="button" class="xs-lien maison-materiaux-lien">Découvrir<span class="xs-lien-trait"></span></button>
          </div>

          <div class="maison-closing">
            <div class="maison-divider maison-divider--small"></div>
            <p class="maison-closing-text">L'accès privé demeure ouvert à ceux qui souhaitent nous rejoindre.</p>
            <span class="maison-closing-link" onclick="navigate('home')">Rejoindre la liste privée</span>
          </div>
        </div>
      `;
    }

    function renderContact() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="contact-view animate-in">
          <span class="contact-eyebrow">Nous écrire</span>
          <h1 class="contact-title">Contact</h1>
          <p class="contact-subtitle">Une question sur une pièce, une commande,<br>ou simplement envie d\u2019en savoir plus.</p>
          <form class="contact-form" onsubmit="handleContact(event)">
            <input type="text" class="contact-input" placeholder="Votre nom" required/>
            <input type="email" class="contact-input" placeholder="Votre adresse email" required/>
            <textarea class="contact-input contact-textarea" placeholder="Votre message"></textarea>
            <button type="submit" class="contact-btn">Envoyer</button>
          </form>
          <p class="contact-email-alt">Ou directement par email : <a href="mailto:contact@xerxes.com">contact@xerxes.com</a></p>
        </div>
      `;
    }

    function renderMentions() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="mentions-view animate-in">
          <h1 class="mentions-title">Mentions légales</h1>

          <div class="mentions-section">
            <span class="mentions-section-title">Éditeur</span>
            <p class="mentions-body">Xerxès; marque déposée. Genève, Suisse.<br>Email : contact@xerxes.com</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">Politique de confidentialité</span>
            <p class="mentions-body">Les informations collectées via ce site sont utilisées uniquement dans le cadre de la relation commerciale. Elles ne sont jamais transmises à des tiers. Conformément au RGPD, vous disposez d\u2019un droit d\u2019accès, de rectification et de suppression de vos données.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">Conditions générales de vente</span>
            <p class="mentions-body">Contenu à venir. Pour toute question relative à une commande, contactez-nous à contact@xerxes.com</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">Propriété intellectuelle</span>
            <p class="mentions-body">L\u2019ensemble des éléments composant ce site (textes, visuels, identité visuelle) sont la propriété exclusive de Xerxès. Toute reproduction est interdite sans autorisation préalable.</p>
          </div>
        </div>
      `;
    }

    function renderCGV() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="mentions-view animate-in">
          <h1 class="mentions-title">Conditions générales de vente</h1>

          <div class="mentions-section">
            <p class="mentions-body">Les présentes conditions régissent la vente des pièces Xerxès et l\u2019usage de notre site. En passant commande, vous en acceptez les termes. Nous vous invitons à les lire ; elles sont écrites pour être claires.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">1. Notre maison</span>
            <p class="mentions-body">Le site est édité par Xerxès, maison de joaillerie établie à Genève, 40 chemin de Grange-Canal, 1224 Chêne-Bougeries, Suisse. Sur l\u2019ensemble du site, les termes « nous », « notre » et « nos » désignent Xerxès. Toute question relative aux présentes conditions peut nous être adressée par écrit.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">2. Nos pièces</span>
            <p class="mentions-body">Xerxès conçoit des bagues et des bracelets en éditions limitées et numérotées, pensés en duo, une pièce par partenaire. Chaque pièce est présentée avec sa description, ses matériaux, son édition et son prix, exprimé en francs suisses (CHF) et toutes taxes comprises le cas échéant.<br><br>Nous nous efforçons de restituer les couleurs et les finitions de nos pièces avec la plus grande fidélité. L\u2019affichage à l\u2019écran peut toutefois varier d\u2019un appareil à l\u2019autre ; une légère différence de teinte ne saurait constituer un défaut.<br><br>Nos éditions étant limitées, une pièce peut ne plus être disponible au moment de la commande. Nous nous réservons le droit de limiter les quantités et de clore une édition.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">3. Commande</span>
            <p class="mentions-body">La commande est validée après confirmation du paiement. Nous vous adressons alors un courriel de confirmation récapitulant votre commande. Nous nous réservons le droit de refuser ou d\u2019annuler toute commande pour un motif légitime, notamment en cas d\u2019indisponibilité de la pièce, d\u2019erreur manifeste sur le prix, ou de soupçon de fraude. En pareil cas, tout montant déjà prélevé vous est intégralement remboursé.<br><br>Vous vous engagez à fournir des informations exactes et à jour lors de la commande, afin que nous puissions la traiter et vous contacter si nécessaire.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">4. Prix et paiement</span>
            <p class="mentions-body">Les prix sont indiqués sur chaque fiche produit et peuvent être modifiés à tout moment ; le prix applicable est celui affiché au moment de la commande. Le paiement s\u2019effectue en ligne, de manière sécurisée, par l\u2019intermédiaire de notre prestataire Stripe. Vos données bancaires sont traitées directement par Stripe et ne sont jamais stockées par Xerxès.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">5. Livraison</span>
            <p class="mentions-body">Nous expédions nos pièces à l\u2019adresse indiquée lors de la commande. Les délais et zones de livraison, ainsi que les éventuels frais de port, sont précisés au moment de la commande. Les délais annoncés sont indicatifs ; un retard raisonnable ne saurait donner lieu à annulation ou dédommagement. Le risque de perte ou de dommage est transféré à réception de la pièce.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">6. Droit de rétractation et retours</span>
            <p class="mentions-body">Vous disposez d\u2019un délai de quatorze (14) jours à compter de la réception de votre pièce pour exercer votre droit de rétractation, sans avoir à justifier de motif. La pièce doit nous être retournée dans son état d\u2019origine, non portée, complète et dans son écrin. Les modalités de retour et de remboursement sont détaillées dans notre politique de retour. <a style="color:var(--encre); cursor:pointer;" onclick="navigate('retour')">Cliquez ici pour la consulter.</a><br><br>Nos pièces étant des éditions limitées numérotées et, le cas échéant, personnalisées à votre demande, certaines commandes personnalisées peuvent être exclues du droit de rétractation ; cela vous est indiqué clairement avant l\u2019achat.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">7. Garantie</span>
            <p class="mentions-body">Nos pièces bénéficient de la garantie légale pour les défauts de conformité prévue par le droit suisse. Si une pièce présente un défaut de matière ou de fabrication, nous nous engageons à la réparer, la remplacer ou la rembourser. Cette garantie ne couvre pas l\u2019usure normale, les dommages résultant d\u2019un usage inapproprié, ni les altérations survenues après la réception.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">8. Propriété intellectuelle</span>
            <p class="mentions-body">L\u2019ensemble des éléments du site, dénominations, univers visuel, textes, images et créations, demeure la propriété exclusive de Xerxès. Toute reproduction ou exploitation, totale ou partielle, sans notre autorisation écrite, est interdite.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">9. Données personnelles</span>
            <p class="mentions-body">Le traitement de vos données personnelles est régi par notre politique de confidentialité, conforme à la loi fédérale suisse sur la protection des données (nLPD) et, lorsqu\u2019il s\u2019applique, au Règlement général sur la protection des données (RGPD). <a style="color:var(--encre); cursor:pointer;" onclick="navigate('confidentialite')">Cliquez ici pour la consulter.</a></p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">10. Responsabilité</span>
            <p class="mentions-body">Nous mettons tout en œuvre pour assurer l\u2019exactitude des informations du site et la continuité du service. Notre responsabilité ne saurait toutefois être engagée pour les dommages indirects, ni au-delà de ce que permet le droit applicable. Rien dans les présentes conditions n\u2019écarte les droits que la loi vous reconnaît de manière impérative.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">11. Résiliation</span>
            <p class="mentions-body">Les présentes conditions s\u2019appliquent tant que vous utilisez notre site et nos services. Nous nous réservons le droit d\u2019en suspendre l\u2019accès en cas de manquement grave à ces conditions.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">12. Droit applicable et for</span>
            <p class="mentions-body">Les présentes conditions sont régies par le droit suisse. Tout litige relatif à leur validité, leur interprétation ou leur exécution relève de la compétence exclusive des tribunaux de Genève, sous réserve d\u2019un recours au Tribunal fédéral.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">13. Modifications</span>
            <p class="mentions-body">Nous nous réservons le droit de modifier les présentes conditions à tout moment. La version en vigueur est celle publiée sur cette page au jour de votre commande.</p>
          </div>

          <div class="mentions-section">
            <p class="mentions-body" style="opacity:0.3;">Dernière mise à jour : juillet 2026</p>
          </div>
        </div>
      `;
    }

    function renderConfidentialite() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="mentions-view animate-in">
          <h1 class="mentions-title">Politique de confidentialité</h1>

          <div class="mentions-section">
            <p class="mentions-body">Cette politique explique quelles données personnelles nous recueillons lorsque vous visitez notre site ou passez commande, comment nous les utilisons, et les droits dont vous disposez.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">1. Responsable du traitement</span>
            <p class="mentions-body">Les données personnelles collectées sur ce site sont traitées par Xerxès, établie 40 chemin de Grange-Canal, 1224 Chêne-Bougeries, Genève, Suisse. Pour toute question relative à vos données, vous pouvez nous écrire à l\u2019adresse indiquée en fin de document.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">2. Données que nous recueillons</span>
            <p class="mentions-body">Nous recueillons uniquement les données nécessaires à notre relation avec vous :<br><br>· Données de commande : nom, adresse de livraison et de facturation, adresse e-mail, numéro de téléphone.<br>· Données de paiement : traitées directement par notre prestataire Stripe. Xerxès ne stocke jamais vos coordonnées bancaires.<br>· Données de navigation : lorsque vous consultez le site, certaines données techniques (adresse IP, type de navigateur) peuvent être traitées à des fins de sécurité et de bon fonctionnement.<br>· Données de contact : si vous rejoignez notre liste privée, l\u2019adresse e-mail que vous nous confiez.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">3. Pourquoi nous les utilisons</span>
            <p class="mentions-body">Chaque traitement repose sur une base légale :<br><br>· Traiter et livrer vos commandes, vous adresser confirmations et factures : exécution du contrat.<br>· Vous adresser nos communications si vous avez rejoint la liste privée : votre consentement, révocable à tout moment.<br>· Prévenir la fraude et sécuriser le site : notre intérêt légitime.<br>· Répondre à nos obligations légales et comptables.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">4. Avec qui nous les partageons</span>
            <p class="mentions-body">Nous ne vendons ni ne louons vos données. Nous les confions uniquement aux prestataires nécessaires au fonctionnement du site, tenus de les protéger :<br><br>· Stripe, pour le traitement sécurisé des paiements.<br>· Vercel, pour l\u2019hébergement du site.<br>· Notre prestataire d\u2019envoi d\u2019e-mails, le cas échéant, pour la liste privée.<br>· Le transporteur chargé de livrer votre commande.<br><br>Certains de ces prestataires peuvent traiter des données hors de Suisse ; nous veillons alors à ce que des garanties de protection appropriées soient en place. Vos données peuvent également être communiquées si la loi l\u2019exige.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">5. Combien de temps nous les conservons</span>
            <p class="mentions-body">Les données de commande sont conservées le temps requis par nos obligations légales et comptables, généralement dix ans pour les documents de facturation. Les données liées à la liste privée sont conservées jusqu\u2019à ce que vous vous désinscriviez.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">6. Vos droits</span>
            <p class="mentions-body">Conformément à la loi fédérale suisse sur la protection des données (nLPD) et, lorsqu\u2019il s\u2019applique, au Règlement général sur la protection des données (RGPD), vous disposez d\u2019un droit d\u2019accès, de rectification, d\u2019effacement, d\u2019opposition et de portabilité de vos données. Vous pouvez également retirer votre consentement à tout moment. Pour exercer ces droits, écrivez-nous à l\u2019adresse ci-dessous.<br><br>Vous avez enfin le droit d\u2019introduire une réclamation auprès de l\u2019autorité compétente, en Suisse le Préposé fédéral à la protection des données et à la transparence (PFPDT).</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">7. Cookies</span>
            <p class="mentions-body">Notre site utilise uniquement les cookies nécessaires à son bon fonctionnement, notamment pour mémoriser votre panier. Nous n\u2019utilisons pas de cookies publicitaires ni de suivi comportemental. Si cela venait à changer, votre consentement vous serait demandé au préalable.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">8. Mineurs</span>
            <p class="mentions-body">Ce site et nos produits s\u2019adressent à des personnes ayant atteint l\u2019âge de la majorité. Nous ne recueillons pas sciemment de données concernant des mineurs.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">9. Modifications</span>
            <p class="mentions-body">Nous pouvons faire évoluer cette politique afin de refléter nos pratiques ou une évolution légale. La version en vigueur est celle publiée sur cette page.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">10. Nous contacter</span>
            <p class="mentions-body">Pour toute question ou demande relative à vos données personnelles, écrivez-nous à contact@xerxes.com, ou par courrier au 40 chemin de Grange-Canal, 1224 Chêne-Bougeries, Genève, Suisse.</p>
          </div>

          <div class="mentions-section">
            <p class="mentions-body" style="opacity:0.3;">Dernière mise à jour : juillet 2026</p>
          </div>
        </div>
      `;
    }

    function renderRetour() {
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="mentions-view animate-in">
          <h1 class="mentions-title">Politique de retour</h1>

          <div class="mentions-section">
            <p class="mentions-body">Chaque pièce Xerxès est pensée pour durer. Si votre commande ne vous convient pas, voici comment nous procédons pour un retour, dans le respect de vos droits.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">1. Délai de rétractation</span>
            <p class="mentions-body">Vous disposez de quatorze (14) jours à compter de la réception de votre commande pour nous informer de votre souhait de la retourner, sans avoir à en justifier le motif. Il vous suffit de nous écrire à contact@xerxes.com. Vous disposez ensuite d\u2019un délai raisonnable pour nous renvoyer la pièce.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">2. État de la pièce</span>
            <p class="mentions-body">Pour être reprise, la pièce doit nous être retournée non portée, dans son état d\u2019origine, complète et dans son écrin. Une pièce visiblement portée, altérée ou incomplète ne pourra faire l\u2019objet d\u2019un remboursement intégral.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">3. Pièces personnalisées</span>
            <p class="mentions-body">Nos éditions sont limitées et numérotées. Lorsqu\u2019une pièce a été personnalisée à votre demande, par exemple une gravure, elle ne peut être reprise, sauf défaut de notre part. Cette exclusion vous est indiquée clairement avant l\u2019achat.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">4. Remboursement</span>
            <p class="mentions-body">Dès réception et vérification de la pièce retournée, nous vous confirmons par e-mail la bonne prise en charge de votre retour. Le remboursement est effectué sur votre moyen de paiement initial, via Stripe, dans les meilleurs délais. Le droit de rétractation s\u2019applique à toutes nos pièces, y compris celles acquises pendant une offre.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">5. Pièce défectueuse</span>
            <p class="mentions-body">Si vous recevez une pièce présentant un défaut de matière ou de fabrication, ou si elle a été endommagée durant le transport, contactez-nous à contact@xerxes.com. Nous prenons alors en charge son remplacement ou son remboursement, frais de retour compris.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">6. Frais et modalités de retour</span>
            <p class="mentions-body">Sauf en cas de défaut de notre part, les frais de retour sont à votre charge. Nos pièces ayant de la valeur, nous vous recommandons un envoi suivi et assuré ; nous ne pouvons être tenus responsables d\u2019un colis perdu lors de son acheminement vers nous.<br><br>Les retours sont à adresser à : Xerxès, 40 chemin de Grange-Canal, 1224 Chêne-Bougeries, Genève, Suisse.</p>
          </div>

          <div class="mentions-section">
            <span class="mentions-section-title">7. Une question</span>
            <p class="mentions-body">Pour toute question relative à un retour ou un échange, écrivez-nous à contact@xerxes.com. Nous vous répondons personnellement.</p>
          </div>

          <div class="mentions-section">
            <p class="mentions-body" style="opacity:0.3;">Dernière mise à jour : juillet 2026</p>
          </div>
        </div>
      `;
    }

    function handleContact(e) {
      e.preventDefault();
      e.target.innerHTML = '<p style="font-family:\'Cormorant Garamond\',serif; font-size:18px; font-style:italic; color:var(--accent); opacity:0.7; text-align:center; padding:20px 0;">Message envoyé. Nous vous répondrons sous 48h.</p>';
    }

    function handleNewsletter() {
      const input = document.getElementById('nl-input');
      const success = document.getElementById('nl-success');
      if (input && input.value.includes('@')) {
        input.parentElement.style.opacity = '0.3';
        input.parentElement.style.pointerEvents = 'none';
        success.classList.add('visible');
      }
    }
