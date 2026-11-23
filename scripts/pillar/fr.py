# -*- coding: utf-8 -*-
"""Partner-visa pillar copy — French."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TITLE = "Visa partenaire Australie : 820/801 et 309/100"
DESCRIPTION = ("Quel visa partenaire vous concerne, son coût, les preuves attendues et "
               "les deux étapes — par des agents enregistrés MARN.")

H1 = "Visa partenaire en Australie : quelle voie, quel coût, quels délais"
BADGE = "Sous-classes 820/801 · 309/100 · 300"
LEAD = ("Le visa partenaire permet au conjoint ou au partenaire de fait d’un citoyen australien, "
        "d’un résident permanent ou d’un citoyen néo-zélandais éligible de le rejoindre en Australie. "
        "Il existe trois voies, et la bonne dépend de l’endroit où vous vous trouvez au moment de la "
        "demande — pas de celle qui semble la plus rapide.")
REVIEWED = "Vérifié par Natasha Arens, MARN 0534230 · Informations à jour en novembre 2026"

P = '    <p class="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">%s</p>'
BULLETS = '    <ul class="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-slate-600 dark:text-slate-300">%s</ul>'
TABLE = """    <div class="mt-5 overflow-x-auto"><table class="w-full border-collapse text-left text-sm">
      <thead><tr class="border-b border-navy-800/15 dark:border-white/15">%s</tr></thead>
      <tbody>%s</tbody></table></div>"""
TH = '<th class="py-3 pr-4 font-tech text-xs font-semibold uppercase tracking-wider text-slate-500">%s</th>'
TD = '<td class="py-2.5 pr-4 align-top text-slate-600 dark:text-slate-300">%s</td>'
TR = '      <tr class="border-b border-navy-800/10 dark:border-white/10">%s</tr>'
LINK = 'class="font-medium text-cobalt-500 transition hover:text-cobalt-400 dark:text-gold-400 dark:hover:text-gold-400"'


def p(text):
    return P % text


def ul(items):
    return BULLETS % "".join(f"<li>{i}</li>" for i in items)


def table(headers, body_rows):
    head = "".join(TH % h for h in headers)
    body = "".join(TR % "".join(TD % c for c in r) for r in body_rows)
    return TABLE % (head, body)


cost_rows = [
    (f'<a href="{href}" {LINK}>{label}</a>', gov, fee + " AUD")
    for label, href, gov, fee in [
        ("820/801 Partenaire (en Australie)", "/fr/visas/partner-visa-820-801", "à partir de 11 710 $ (demandeur principal)", "$5,500"),
        ("309/100 Partenaire (hors Australie)", "/fr/visas/partner-visa-309-100", "à partir de 11 710 $ (demandeur principal)", "$5,500"),
        ("300 Futur conjoint", "/fr/visas/prospective-marriage-300", "11 710 $", "$5,500"),
    ]]

SECTIONS = [
("En bref", table(
    ["Voie", "Où vous devez être", "Première étape", "Deuxième étape", "Frais gouvernementaux"],
    [["820/801 en Australie", "En Australie lors de la demande", "820 (temporaire)", "801 (permanent)", "à partir de 11 710 $"],
     ["309/100 hors Australie", "Hors d’Australie lors de la demande et de la décision", "309 (temporaire)", "100 (permanent)", "à partir de 11 710 $"],
     ["300 futur conjoint", "Hors d’Australie", "300 (9 mois pour se marier)", "puis 820/801 en Australie", "11 710 $"]])
    + p("La plupart des visas partenaires temporaires sont examinés en 12 à 24 mois environ. L’étape permanente est généralement évaluée environ deux ans après le dépôt, si la relation continue.")),

("Quelle voie vous concerne", p("La voie dépend de votre situation et de l’endroit où vous vous trouvez au moment de la demande ; se tromper de voie est l’un des motifs de refus les plus fréquents — et les plus évitables.") + table(
    ["Si vous…", "Demandez"],
    [["êtes marié ou en relation de fait et êtes en Australie avec un visa substantiel", "820/801 (en Australie)"],
     ["êtes marié ou en relation de fait et êtes à l’étranger, ou ne pouvez pas venir", "309/100 (hors Australie)"],
     ["prévoyez de vous marier et ne remplissez pas encore la condition de relation de fait", "300, puis 820/801 en Australie"],
     ["êtes en Australie sans visa substantiel", "Parlez-nous avant tout dépôt : le visa de transition et le calendrier changent les options"]])
    + p(f'Le détail des preuves est sur les pages <a href="/fr/visas/partner-visa-820-801" {LINK}>820/801</a> et <a href="/fr/visas/partner-visa-309-100" {LINK}>309/100</a>.')),

("Votre partenaire peut-il vous parrainer ?", p("Le parrain doit être citoyen australien, résident permanent ou citoyen néo-zélandais éligible ; avoir 18 ans ou plus et, en règle générale, résider en Australie. Le parrainage est une demande distincte : l’historique du parrain compte autant que celui du demandeur.") + ul([
    "Aucune interdiction de parrainer — par exemple un parrainage précédent dans les cinq dernières années, ou avoir soi-même été parrainé comme partenaire",
    "Le parrain peut respecter les engagements du parrainage, y compris l’obligation de soutien",
    "Bonne réputation, avec les extraits de casier judiciaire exigés",
]) + p("Un parrainage qui échoue entraîne le refus du visa : nous évaluons donc le parrain avant de préparer le dossier.")),

("Votre relation est-elle reconnue ?", p("Le droit australien reconnaît le mariage et la relation de fait. Le mariage doit être valable en droit australien ; la relation de fait suppose en principe 12 mois de vie commune immédiatement avant la demande, sauf exception :") + ul([
    "La relation est enregistrée auprès d’un registre d’un État ou territoire australien",
    "Il existe des circonstances impérieuses et compassionnelles",
    "La relation relève de la définition de relation de fait enregistrée au sens des Migration Regulations",
]) + p("Une séparation temporaire — pour le travail, les études ou la famille — ne met pas fin à la relation de fait, si vous n’êtes pas définitivement séparés. Les couples de même sexe sont évalués exactement selon les mêmes règles.")),

("Les quatre aspects de la relation", p("La décision repose sur quatre aspects. Un dossier solide est cohérent sur les quatre ; un dossier faible est souvent fort sur un seul (souvent les photos) et muet sur le reste.") + table(
    ["Aspect", "Ce qui est évalué", "Preuves typiques"],
    [["Financier", "Finances communes et obligations réciproques", "Compte joint et relevés, factures partagées, virements, prêts communs, bénéficiaires d’assurance, testaments"],
     ["Foyer", "Logement et vie quotidienne partagés", "Bail ou prêt immobilier aux deux noms, comptes de charges, courrier à la même adresse, répartition des tâches"],
     ["Social", "Comment l’entourage perçoit la relation", "Déclarations Form 888 de citoyens ou résidents permanents, invitations, photos dans le temps, voyages communs"],
     ["Engagement", "Profondeur et durée de l’engagement", "Durée de la relation et de la vie commune, projets, connaissance de la situation de l’autre, correspondance"]])
    + p("Le volume n’est pas la mesure — la cohérence l’est. Les contradictions entre formulaires, déclarations et chronologie sont ce qu’il y a de plus destructeur dans les dossiers refusés.")),

("Les deux étapes : 820 puis 801", p("La voie en Australie est une seule demande examinée en deux étapes. Le 820 (temporaire) est décidé d’abord ; le 801 (permanent) est évalué environ deux ans après le dépôt, normalement sans second frais de demande. Les couples en relation de longue durée — trois ans ensemble, ou deux ans avec un enfant — peuvent obtenir les deux étapes ensemble.") + ul([
    "Le 820 donne généralement le droit de travailler, d’étudier et l’accès à Medicare",
    "La relation doit rester authentique à l’étape 801, et tout changement doit être signalé au ministère",
    "La voie hors Australie 309/100 fonctionne de la même manière, avec les mêmes deux étapes",
])),

("Combien cela coûte", table(["Visa", "Frais gouvernementaux", "Nos honoraires"], cost_rows)
    + p("Les frais gouvernementaux sont payés au ministère de l’Intérieur et calculés par demandeur : 11 710 $ pour le demandeur principal, 5 855 $ pour un demandeur secondaire de 18 ans ou plus, 2 930 $ pour un enfant de moins de 18 ans. Les frais de tiers s’ajoutent : visites médicales, extraits de casier judiciaire dans chaque pays de résidence, traductions NAATI et vérifications du parrain.")
    + p(f'La grille complète, pour tous les visas traités, figure sur la page <a href="/fr/pricing" {LINK}>tarifs</a>. En cas de refus, la révision à l’ART est une affaire distincte : 5 500 $ d’honoraires et 3 496 $ de frais gouvernementaux, dont 50 % sont remboursés si la révision aboutit.')),

("Délais, et ce qui les change", p("Les délais publiés évoluent : traitez tout chiffre — y compris le nôtre — comme un ordre de grandeur. En pratique, la plupart des demandes 820 sont examinées en 12 à 24 mois, et le 801 environ deux ans après le dépôt. Ce qui déplace réellement la date :") + ul([
    "La complétude et la cohérence des preuves au dépôt — les dossiers qui reçoivent plusieurs demandes de complément perdent des mois",
    "L’approbation du parrainage, qui avance en parallèle mais peut bloquer le dossier si l’historique du parrain doit être expliqué",
    "Les visites médicales et les extraits de casier judiciaire étrangers, surtout si un pays tarde à délivrer",
    "Toute demande au titre de l’article 56, qui a un délai et n’arrête pas le compteur",
]) + p(f'Les délais publiés figurent sur la page du <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times" rel="noopener" target="_blank" {LINK}>ministère de l’Intérieur</a>.')),

("Pourquoi les demandes sont refusées", p("Les refus portent rarement sur la force de l’histoire. Ils portent sur les preuves et la mécanique :") + ul([
    "Des preuves concentrées sur un seul aspect — souvent des photos — sans rien sur les finances ou le foyer",
    "Des dates, adresses ou emplois incohérents entre la demande, les déclarations et les lettres de soutien",
    "Un parrain interdit de parrainage, ou dont l’historique n’a pas été déclaré",
    "La mauvaise voie : une demande hors Australie déposée depuis l’Australie, ou un 300 déposé par un couple déjà en vie commune",
    "Des déclarations Form 888 manquantes ou irrégulières, ou des déclarants qui ne sont pas citoyens ou résidents permanents",
    "Des questions de santé ou de réputation laissées sans réponse au lieu d’être expliquées",
])),

("Dispositions sur la violence familiale", p("Si la relation prend fin en raison de violences familiales, le demandeur secondaire peut malgré tout obtenir le visa alors que la relation est terminée. Ces dispositions existent précisément pour qu’une personne ne reste pas dans une relation violente pour conserver son statut. Les exigences de preuve sont spécifiques et l’examen est confidentiel — nous expliquons ce qui est nécessaire, et ce qui ne l’est pas, avant tout dépôt.")),

("Après la décision", table(
    ["Étape", "Ce que vous pouvez faire"],
    [["820 (temporaire)", "Vivre, travailler et étudier en Australie ; accéder à Medicare ; voyager pendant la validité ; rester parrainé"],
     ["801 (permanent)", "Rester indéfiniment, parrainer des proches plus tard, demander la citoyenneté une fois la condition de résidence remplie"]])
    + p("Le 801 n’est pas automatique — le ministère doit encore être convaincu, à cette étape, que la relation est authentique et continue. C’est pourquoi nous tenons le dossier de preuves à jour pendant les deux ans.")),

("Pourquoi un agent enregistré", p("Un agent de migration enregistré est lié par le Code de conduite des agents de migration, doit agir dans votre intérêt et rend des comptes à l’autorité d’enregistrement. Concrètement : un plan de preuves avant le dépôt, une seconde lecture de chaque déclaration, des honoraires fixes convenus par écrit et la connaissance de ce qu’exige réellement une demande au titre de l’article 56.") + p(f'Nos agents sont Natasha Arens (MARN 0534230) et Sergey Vinnichenko (MARN 2418663) — <a href="/fr/team" {LINK}>rencontrez l’équipe</a>, ou comparez d’abord les <a href="/fr/visas" {LINK}>autres voies de visa</a>.')),
]

FAQ_TITLE = "Questions sur le visa partenaire"
FAQ = [
("Combien coûte un visa partenaire au total ?",
 "Trois montants : les frais gouvernementaux (à partir de 11 710 $ pour le demandeur principal, 5 855 $ pour un demandeur secondaire de 18 ans ou plus, 2 930 $ pour un enfant de moins de 18 ans), nos honoraires de 5 500 $ et les frais de tiers — visites médicales, extraits de casier judiciaire et traductions. Nos honoraires sont fixés dans la lettre de mission avant le début du travail."),
("Quels sont les délais d’un visa partenaire ?",
 "La plupart des visas partenaires temporaires sont examinés en 12 à 24 mois environ, et l’étape permanente est généralement évaluée deux ans après le dépôt. Les délais publiés varient selon la voie et le pays ; nous planifions donc les preuves selon la fourchette publiée, sans promettre de date."),
("Faut-il être marié pour demander ?",
 "Non. La relation de fait ouvre les mêmes droits que le mariage, si vous avez vécu ensemble au moins 12 mois immédiatement avant la demande, ou si la relation est enregistrée dans un État ou territoire australien, ou en présence de circonstances impérieuses."),
("Combien de temps faut-il avoir vécu ensemble ?",
 "Douze mois immédiatement avant la demande, sauf relation enregistrée ou circonstances impérieuses et compassionnelles. Une séparation temporaire pour le travail, les études ou la famille ne remet pas le compteur à zéro."),
("Puis-je travailler pendant l’examen de la demande ?",
 "En général oui. Le visa de transition lié à une demande déposée en Australie donne généralement le droit de travailler dès la fin du visa en cours, et le 820 lui-même donne le droit de travailler et d’étudier. Les conditions dépendent du visa détenu au moment de la demande : nous vérifions votre cas précis."),
("Puis-je inclure mes enfants dans la demande ?",
 "Oui — les enfants à charge peuvent être inclus, et les frais gouvernementaux s’appliquent par demandeur. Signalez tous les enfants, y compris d’une relation précédente, avant le devis : cela change à la fois les frais et les preuves exigées."),
("Que se passe-t-il si la relation se termine avant le 801 ?",
 "Vous devez le signaler au ministère. Si la relation prend fin en raison de violences familiales, les dispositions applicables peuvent permettre d’obtenir le visa. Sinon, la demande est généralement retirée ou refusée, et les options dépendent de votre situation."),
("Que se passe-t-il en cas de refus ?",
 "Un refus peut être contesté devant le Tribunal administratif de révision (ART) dans le délai indiqué dans la décision. Nous évaluons d’abord le bien-fondé et vous disons honnêtement si la révision vaut son coût : 5 500 $ d’honoraires et 3 496 $ de frais gouvernementaux, dont 50 % remboursés en cas de succès."),
("L’enregistrement de la relation aide-t-il ?",
 "Il supprime l’exigence de 12 mois de vie commune, ce qui compte pour les couples qui vivent ensemble depuis peu. Il ne réduit pas les preuves nécessaires pour démontrer que la relation est authentique et continue."),
("Quelle voie est la plus rapide, en Australie ou hors Australie ?",
 "Il n’existe pas de différence fiable, et choisir pour la vitesse se retourne souvent contre le demandeur. Choisissez selon l’endroit où vous pouvez légalement être lors de la demande et de la décision, et selon que vous remplissez la condition de relation de fait ou avez besoin de la voie 300."),
]
