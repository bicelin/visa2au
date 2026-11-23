#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate /contract-compliance in EN, RU and FR from the v20 Service Agreement.

Source of truth: Service_Agreement_Visa2AU_v20_SOURCE.md (clauses 1.1–15) plus the
Schedule A cross-reference style of v8. Instrument names stay in English in every
locale (they are proper names of Commonwealth instruments); only the explanatory
prose is translated.

Chrome (head/header/footer) is taken from an existing page of each language, so the
pages inherit the live navigation, the CSP-safe scripts and the footer links.

The English page is authoritative: RU/FR pages carry an explicit note that the
English text and the signed Agreement prevail.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "app")
DONOR = {"en": "contract-compliance.html", "ru": "ru/pricing.html", "fr": "fr/pricing.html"}
UPDATED = "23 November 2026"
VERSION = "20"

# (clause, subject, governing reference) — reference text is English in every locale
ROWS = [
    ("1.1", ("Parties and company identity", "Стороны и идентификация компании", "Parties et identité de la société"),
     "<em>Corporations Act 2001</em> (Cth) (company existence and capacity); common law of contract"),
    ("1.2", ("Registered Migration Agents — who may give immigration assistance", "Зарегистрированные миграционные агенты — кто вправе оказывать иммиграционную помощь", "Agents de migration agréés — qui peut fournir une aide à l’immigration"),
     "<em>Migration Act 1958</em> (Cth) s 276 (what is “immigration assistance”); Code Part 2 (general duties)"),
    ("1.3", ("Client details and authority to act for secondary applicants", "Данные клиента и полномочия действовать за вторичных заявителей", "Coordonnées du client et pouvoir d’agir pour les demandeurs secondaires"),
     "<em>Migration Act 1958</em> (Cth); <em>Migration Regulations 1994</em> (applicants, sponsors, family members); Code s 42(3)(a), s 42(4)"),
    ("1.4", ("OMARA Consumer Guide acknowledgement before engagement", "Подтверждение получения Consumer Guide OMARA до заключения договора", "Reconnaissance du Consumer Guide OMARA avant l’engagement"),
     "Code s 38 and s 42(3)(d) (Consumer Guide disclosure)"),
    ("1.5", ("Authority to act as your agent and authorised recipient", "Полномочия действовать как ваш агент и уполномоченный получатель", "Pouvoir d’agir comme agent et destinataire autorisé"),
     "<em>Migration Act 1958</em> (Cth) s 276 and s 280 (authorised recipient); Code s 42(1)(a)(ii)"),
    ("1.6", ("Statutory compliance and this cross-reference page", "Соответствие законодательству и эта справочная страница", "Conformité légale et cette page de référence"),
     "<em>Migration Act 1958</em> (Cth); <em>Migration Regulations 1994</em> (Cth); <em>Migration Agents Regulations 2026</em> (Cth); Code of Conduct; <em>Competition and Consumer Act 2010</em> (Cth); <em>Privacy Act 1988</em> (Cth)"),
    ("2.1–2.2", ("Scope of work, written variations and excluded services", "Объём работ, изменения в письменной форме и исключённые услуги", "Étendue des services, variations écrites et services exclus"),
     "<em>Migration Act 1958</em> (Cth) s 276 (the acts that constitute immigration assistance); Code s 42(3)(b)–(c)"),
    ("2.3", ("NAATI-standard translation of documents not in English", "Перевод документов не на английском по стандарту NAATI", "Traduction NAATI des documents non rédigés en anglais"),
     "<em>Migration Act 1958</em> (Cth) s 276(3)(b) (translation and interpretation are not immigration assistance)"),
    ("2.4", ("Client review and written sign-off before lodgement", "Проверка клиентом и письменное подтверждение до подачи", "Relecture du client et accord écrit avant le dépôt"),
     "<em>Migration Regulations 1994</em> (Cth) Sch 4, PIC 4020 (false or misleading information); Code s 42(3)"),
    ("2.5", ("No guarantee of outcome; indicative processing times", "Отсутствие гарантии результата; ориентировочные сроки", "Aucune garantie de résultat ; délais indicatifs"),
     "Code s 24 and s 42(3) (realistic advice); <em>Migration Act 1958</em> (Cth) (the visa decision is the Minister’s)"),
    ("2.6", ("Staged and onward applications; later stages and their fees", "Поэтапные и последующие заявления; следующие этапы и их стоимость", "Demandes par étapes et étapes ultérieures ; frais correspondants"),
     "Code s 42(3)(b) (scope) and s 44 (notice of variations); Code s 24 (no guarantee of a later stage)"),
    ("3.1", ("Supervision, staff standards and who advises your file", "Надзор, стандарты персонала и кто ведёт ваше дело", "Supervision, normes du personnel et qui traite votre dossier"),
     "Code s 35 (supervision of persons who are not agents); Code Part 2"),
    ("3.2", ("Practice systems, cloud storage and automated or AI tools", "Практические системы, облачное хранение и автоматизированные/AI-инструменты", "Systèmes de gestion, stockage cloud et outils automatisés ou IA"),
     "<em>Privacy Act 1988</em> (Cth) — APPs 1, 6, 8 and 11 (open and transparent management, use, cross-border disclosure, security); Code s 30"),
    ("4", ("Client obligations: truthful information, disclosures and documents", "Обязанности клиента: достоверность, раскрытие сведений и документы", "Obligations du client : informations véridiques, divulgations et documents"),
     "<em>Migration Regulations 1994</em> (Cth) Sch 4, PIC 4020 (bogus documents, false or misleading information); <em>Migration Act 1958</em> (Cth)"),
    ("5", ("Our service obligations and professional indemnity insurance", "Наши обязанности и страхование профессиональной ответственности", "Nos obligations de service et assurance de responsabilité professionnelle"),
     "Code Part 2; <em>Migration Agents Regulations 2026</em> (Cth) (professional indemnity requirements); <em>Privacy Act 1988</em> (Cth)"),
    ("6.1", ("Flat professional fee, GST and tax invoice", "Фиксированный гонорар, GST и налоговый счёт", "Honoraires forfaitaires, GST et facture fiscale"),
     "<em>A New Tax System (Goods and Services Tax) Act 1999</em> (Cth) (10% GST, tax invoice); Code Part 5 Div 3"),
    ("6.2, 6.2.1–6.2.4", ("Clients’ account, payment terms, payment options and withdrawals", "Счёт клиентов, условия оплаты, способы оплаты и списания", "Compte clients, conditions de paiement, moyens de paiement et retraits"),
     "Code ss 48–50 (clients’ account handling, receipting and withdrawals)"),
    ("6.2.3", ("Payment options, card surcharge and bank-transfer option", "Способы оплаты, комиссия за карту и вариант банковского перевода", "Moyens de paiement, surcharge carte et option de virement"),
     "<em>Competition and Consumer Act 2010</em> (Cth) Sch 2, s 18 (misleading conduct — surcharge must be disclosed before payment); Code Part 5 Div 3"),
    ("6.3", ("Third-party fees, statutory VAC indexation and third-party service fees", "Сторонние сборы, индексация VAC и сервисные сборы третьих лиц", "Frais de tiers, indexation des VAC et frais de service de tiers"),
     "Code Part 5 Div 3 (disbursements, disclosure and passing on third-party charges at cost); <em>Migration Regulations 1994</em> (Cth) (visa application charges)"),
    ("6.4", ("Additional work, variations and time-based charging", "Дополнительная работа, изменения и почасовая оплата", "Travaux supplémentaires, variations et facturation horaire"),
     "Code s 44 (notice of variation to a service agreement); Code Part 5 Div 3"),
    ("6.5", ("Pre-lodgement payment condition (cleared funds before lodgement)", "Условие предоплаты до подачи (средства должны быть зачислены)", "Condition de paiement avant dépôt (fonds disponibles)"),
     "Code ss 48–50 (clients’ account before work is performed)"),
    ("6.6", ("Commissions, referral fees and other benefits", "Комиссии, вознаграждения за рекомендации и иные выгоды", "Commissions, frais de recommandation et autres avantages"),
     "Code Part 5 (fees and disbursements — disclosure of benefits received or paid)"),
    ("7.1", ("Refund policy on termination, before and after work commences", "Политика возврата при расторжении — до и после начала работ", "Politique de remboursement en cas de résiliation, avant et après le début des travaux"),
     "Code s 52 (refund of fees and disbursements); <em>Competition and Consumer Act 2010</em> (Cth) Sch 2, ss 60–64 (consumer guarantees)"),
    ("7.2", ("Itemised Statement of Services", "Детализированный отчёт об оказанных услугах", "Relevé détaillé des services"),
     "<em>Migration Act 1958</em> (Cth) s 313 (statement of services); Code s 51"),
    ("8.1–8.2", ("Single point of representation and control of the application record", "Единая точка представительства и контроль записи заявления", "Point unique de représentation et maîtrise du dossier de demande"),
     "<em>Migration Act 1958</em> (Cth) s 276 and s 280 (authorised recipient); Code s 42(1)(a)(ii)"),
    ("8.3", ("Actions only the agent can perform (BVB, conditions, s 56 requests)", "Действия, которые может выполнить только агент (BVB, условия, запросы по s 56)", "Actes réservés à l’agent (BVB, conditions, demandes au titre de l’article 56)"),
     "<em>Migration Act 1958</em> (Cth) (bridging visas, conditions and requests for information); Code s 42(3)(b)"),
    ("9.1–9.2", ("Liability, indemnities and non-excludable consumer guarantees", "Ответственность, возмещение и неисключаемые потребительские гарантии", "Responsabilité, indemnités et garanties consommateur non excluables"),
     "<em>Competition and Consumer Act 2010</em> (Cth) Sch 2, s 64 (guarantees that cannot be excluded); Code Part 2"),
    ("10.1", ("Communication channels and acceptable written instructions", "Каналы связи и допустимые письменные указания", "Canaux de communication et instructions écrites acceptables"),
     "<em>Electronic Transactions Act 1999</em> (Cth) (electronic communications and records); Code s 42(3)"),
    ("10.2", ("Confidentiality and privacy of client information", "Конфиденциальность и защита данных клиента", "Confidentialité et protection des données du client"),
     "<em>Privacy Act 1988</em> (Cth) — APPs 6 and 11; Code s 30"),
    ("10.3", ("Inherent risk of electronic communications", "Неотъемлемый риск электронной связи", "Risque inhérent des communications électroniques"),
     "<em>Privacy Act 1988</em> (Cth) — APP 11 (security of personal information)"),
    ("11", ("Intellectual property in templates, submissions and checklists", "Интеллектуальная собственность на шаблоны, заявления и чек-листы", "Propriété intellectuelle des modèles, soumissions et listes de contrôle"),
     "<em>Copyright Act 1968</em> (Cth) (subsistence and licence of copyright)"),
    ("12.1", ("Termination by the client at any time", "Расторжение договора клиентом в любое время", "Résiliation par le client à tout moment"),
     "Code s 56 (termination of a service agreement by the client)"),
    ("12.2", ("Termination by us for reasonable cause", "Расторжение договора нами при наличии разумных оснований", "Résiliation par nos soins pour motif raisonnable"),
     "Code s 57 (termination of a service agreement by the agent)"),
    ("12.3", ("Actions on termination and return of client documents", "Действия при расторжении и возврат документов клиента", "Mesures en cas de résiliation et restitution des documents"),
     "Code s 54 (duty to deliver client documents); Code s 52 (refund of unearned fees)"),
    ("13", ("File retention for 7 years and secure destruction", "Хранение дела 7 лет и безопасное уничтожение", "Conservation du dossier 7 ans et destruction sécurisée"),
     "<em>Privacy Act 1988</em> (Cth) — APP 11.2 (destroy or de-identify information no longer needed); Code s 55"),
    ("14.1–14.2", ("Internal complaints and external statutory bodies", "Внутренние жалобы и внешние государственные органы", "Réclamations internes et organismes statutaires externes"),
     "Code s 37 (complaints resolution); <em>Competition and Consumer Act 2010</em> (Cth) Sch 2; <em>Australian Information Commissioner Act 2010</em> (Cth)"),
    ("14.3", ("Governing law", "Применимое право", "Droit applicable"),
     "Laws in force in New South Wales, Australia (common law and State statute)"),
    ("15", ("Signatures, acknowledgements and electronic execution", "Подписи, подтверждения и электронное подписание", "Signatures, reconnaissances et signature électronique"),
     "<em>Electronic Transactions Act 1999</em> (Cth) (electronic signatures and records); Code s 42(3)(e)"),
]

T = {
    "en": {
        "title": "Contract Compliance — Clause-to-Law Reference",
        "desc": "How every clause of the Visa2AU Service Agreement maps to the Australian legislation that governs it: Migration Act, Code of Conduct, Privacy Act and ACL.",
        "eyebrow": f"Clause 1.6 reference · Agreement version {VERSION}",
        "h1a": "Contract ", "h1b": "Compliance",
        "lead": "Every clause of the Visa2AU Service Agreement, mapped to the Australian legislation that governs it.",
        "about_h": "About this page",
        "about": [
            f"This page is the clause-to-legislation cross-reference referred to in <strong>clause 1.6</strong> of the "
            f"<strong>Visa2AU Pty Ltd Service Agreement for Immigration Assistance</strong>. It covers <strong>version {VERSION}</strong> "
            f"of the Agreement, which is the version we currently issue, and it was last reviewed on {UPDATED}.",
            "It records, clause by clause, the Commonwealth instruments that govern each part of the Agreement, so that a client can "
            "see why each term exists and which regulator stands behind it.",
            "Where anything on this page differs from the Agreement you have signed, <strong>the signed Agreement prevails</strong>. "
            "This page is a summary of legal instruments only: it is <strong>not legal advice</strong>, it does not vary your Agreement, "
            "and it does not exclude or limit any consumer guarantee under the Australian Consumer Law.",
        ],
        "how_h": "How to read this table",
        "how": [
            "<strong>Clause</strong> — the numbered clause of the Service Agreement (version " + VERSION + ").",
            "<strong>Subject</strong> — what that clause actually does in the engagement.",
            "<strong>Governing legislative provision</strong> — the Commonwealth Act, regulation or Code provision the clause implements.",
        ],
        "instruments_h": "Instruments this Agreement works to",
        "instruments": [
            "<em>Migration Act 1958</em> (Cth)",
            "<em>Migration Regulations 1994</em> (Cth)",
            "<em>Migration Agents Regulations 2026</em> (Cth)",
            "<em>Migration (Migration Agents Code of Conduct) Regulations 2026</em> (Cth) — “the Code”",
            "<em>Competition and Consumer Act 2010</em> (Cth), including the Australian Consumer Law (Schedule 2)",
            "<em>Privacy Act 1988</em> (Cth), including the Australian Privacy Principles (Schedule 1)",
            "<em>Electronic Transactions Act 1999</em> (Cth) and <em>Copyright Act 1968</em> (Cth)",
        ],
        "table_h": "Clause cross-reference",
        "th": ("Clause", "Subject", "Governing legislative provision"),
        "bodies_h": "Who to contact about what",
        "bodies": [
            ("Office of the Migration Agents Registration Authority (OMARA)", "Conduct of registered migration agents",
             '<a href="https://www.mara.gov.au/complain/make-a-complaint" target="_blank" rel="noopener">mara.gov.au/complain</a> &middot; 1300 881 995'),
            ("Australian Competition and Consumer Commission (ACCC)", "Consumer guarantees and fair trading",
             '<a href="https://www.accc.gov.au" target="_blank" rel="noopener">accc.gov.au</a> &middot; 1300 302 502'),
            ("Office of the Australian Information Commissioner (OAIC)", "Privacy and personal information",
             '<a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a> &middot; 1300 363 992'),
        ],
        "th_bodies": ("External body", "What it covers", "Contact"),
        "trans_h": "Language versions",
        "trans": [
            "This page is published in <strong>English, Russian and French</strong>. The <strong>English version is the authoritative text</strong>: "
            "it reproduces the agreement exactly as it was drafted in English, and the signed English Agreement is the document that binds the parties.",
            "The Russian and French versions are provided for the convenience of clients. If a translation differs from the English text in "
            "meaning, <strong>the English text prevails</strong>.",
        ],
        "current_h": "Keeping this page current",
        "current": [
            "Australian migration law, the Code of Conduct and the Australian Consumer Law change from time to time. This table is reviewed "
            f"whenever the Service Agreement is revised — this page currently matches <strong>version {VERSION}</strong>.",
            'If you hold a signed copy of an earlier version of the Agreement and need the table that matches it, contact us at '
            '<a href="mailto:info@visa2.au">info@visa2.au</a>.',
        ],
        "related_h": "Related",
        "related": [
            ("Fees and pricing", "/pricing"),
            ("Contact us", "/contact"),
            ("Visa services", "/visas"),
        ],
        "disclaimer": "This page is a summary of legislative instruments, published for client transparency. It is not legal advice, it does not vary the Service Agreement, and it does not exclude or limit any consumer guarantee under the Australian Consumer Law.",
        "lang_links": (("English", "/contract-compliance"), ("Русский", "/ru/contract-compliance"), ("Français", "/fr/contract-compliance")),
        "lang_note": "English is the authoritative version.",
    },
    "ru": {
        "title": "Соответствие договору — пункты и законы",
        "desc": "Как каждый пункт Сервисного соглашения Visa2AU соотносится с австралийским законодательством: Migration Act, Кодекс поведения, Privacy Act и ACL.",
        "eyebrow": f"Ссылка на пункт 1.6 · версия договора {VERSION}",
        "h1a": "Соответствие ", "h1b": "договору",
        "lead": "Каждый пункт Сервисного соглашения Visa2AU с указанием австралийского законодательства, которое его регулирует.",
        "about_h": "Об этой странице",
        "about": [
            f"Это страница соответствия «пункт — законодательство», на которую ссылается <strong>пункт 1.6</strong> "
            f"<strong>Сервисного соглашения Visa2AU Pty Ltd об иммиграционной помощи</strong>. Она относится к <strong>версии {VERSION}</strong> "
            f"договора — той, которую мы выдаём сейчас, — и последний раз проверялась {UPDATED}.",
            "Она показывает по пунктам, какие акты Содружества регулируют каждую часть договора: клиент видит, зачем существует то или иное условие и какой орган за ним стоит.",
            "Если на этой странице что-то расходится с подписанным вами договором, <strong>действует подписанный договор</strong>. "
            "Эта страница — только перечень правовых актов: она <strong>не является юридической консультацией</strong>, не меняет ваш договор "
            "и не исключает и не ограничивает потребительские гарантии по Australian Consumer Law.",
        ],
        "how_h": "Как читать таблицу",
        "how": [
            "<strong>Пункт</strong> — номер пункта Сервисного соглашения (версия " + VERSION + ").",
            "<strong>Предмет</strong> — что именно регулирует этот пункт в рамках работы по делу.",
            "<strong>Норма законодательства</strong> — акт, регламент или положение Кодекса Содружества, которое этот пункт реализует.",
        ],
        "instruments_h": "Акты, по которым работает договор",
        "instruments": [
            "<em>Migration Act 1958</em> (Cth)",
            "<em>Migration Regulations 1994</em> (Cth)",
            "<em>Migration Agents Regulations 2026</em> (Cth)",
            "<em>Migration (Migration Agents Code of Conduct) Regulations 2026</em> (Cth) — «Кодекс»",
            "<em>Competition and Consumer Act 2010</em> (Cth), включая Australian Consumer Law (Schedule 2)",
            "<em>Privacy Act 1988</em> (Cth), включая Australian Privacy Principles (Schedule 1)",
            "<em>Electronic Transactions Act 1999</em> (Cth) и <em>Copyright Act 1968</em> (Cth)",
        ],
        "table_h": "Соответствие пунктов",
        "th": ("Пункт", "Предмет", "Норма законодательства"),
        "bodies_h": "Куда обращаться и по какому вопросу",
        "bodies": [
            ("Office of the Migration Agents Registration Authority (OMARA)", "Поведение зарегистрированных миграционных агентов",
             '<a href="https://www.mara.gov.au/complain/make-a-complaint" target="_blank" rel="noopener">mara.gov.au/complain</a> &middot; 1300 881 995'),
            ("Australian Competition and Consumer Commission (ACCC)", "Потребительские гарантии и добросовестная торговля",
             '<a href="https://www.accc.gov.au" target="_blank" rel="noopener">accc.gov.au</a> &middot; 1300 302 502'),
            ("Office of the Australian Information Commissioner (OAIC)", "Приватность и персональные данные",
             '<a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a> &middot; 1300 363 992'),
        ],
        "th_bodies": ("Орган", "Что охватывает", "Контакты"),
        "trans_h": "Языковые версии",
        "trans": [
            "Страница публикуется на <strong>английском, русском и французском</strong>. <strong>Английская версия является основным текстом</strong>: "
            "она воспроизводит договор в том виде, в каком он составлен на английском, и обязывает стороны подписанный английский договор.",
            "Русская и французская версии даны для удобства клиентов. Если перевод расходится по смыслу с английским текстом, <strong>действует английский текст</strong>.",
        ],
        "current_h": "Как мы поддерживаем страницу",
        "current": [
            "Австралийское иммиграционное законодательство, Кодекс поведения и Australian Consumer Law меняются. Таблица проверяется при каждом "
            f"пересмотре Сервисного соглашения — сейчас страница соответствует <strong>версии {VERSION}</strong>.",
            'Если у вас подписанный экземпляр более ранней версии договора и нужна таблица под него, напишите нам: '
            '<a href="mailto:info@visa2.au">info@visa2.au</a>.',
        ],
        "related_h": "Связанные страницы",
        "related": [
            ("Стоимость услуг", "/ru/pricing"),
            ("Контакты", "/ru/contact"),
            ("Визовые услуги", "/ru/visas"),
        ],
        "disclaimer": "Эта страница — перечень правовых актов, опубликованный для прозрачности условий работы. Она не является юридической консультацией, не меняет Сервисное соглашение и не исключает и не ограничивает потребительские гарантии по Australian Consumer Law.",
        "lang_links": (("English", "/contract-compliance"), ("Русский", "/ru/contract-compliance"), ("Français", "/fr/contract-compliance")),
        "lang_note": "Основной текст — английский.",
    },
    "fr": {
        "title": "Conformité du contrat — clauses et lois",
        "desc": "Comment chaque clause du contrat de service Visa2AU correspond à la législation australienne : Migration Act, code de conduite, Privacy Act et ACL.",
        "eyebrow": f"Référence à la clause 1.6 · version {VERSION} du contrat",
        "h1a": "Conformité ", "h1b": "du contrat",
        "lead": "Chaque clause du contrat de service Visa2AU, associée à la législation australienne qui la régit.",
        "about_h": "À propos de cette page",
        "about": [
            f"Cette page est le tableau de correspondance « clause — législation » auquel renvoie la <strong>clause 1.6</strong> du "
            f"<strong>contrat de service Visa2AU Pty Ltd pour l’assistance à l’immigration</strong>. Elle couvre la <strong>version {VERSION}</strong> "
            f"du contrat, celle que nous délivrons actuellement, et a été revue le {UPDATED}.",
            "Elle indique, clause par clause, les instruments du Commonwealth qui régissent chaque partie du contrat : le client voit pourquoi chaque "
            "condition existe et quel régulateur la sous-tend.",
            "Si un élément de cette page diffère du contrat que vous avez signé, <strong>le contrat signé prévaut</strong>. Cette page n’est qu’un "
            "récapitulatif d’instruments juridiques : elle <strong>ne constitue pas un conseil juridique</strong>, ne modifie pas votre contrat et "
            "n’exclut ni ne limite aucune garantie consommateur au titre de l’Australian Consumer Law.",
        ],
        "how_h": "Comment lire ce tableau",
        "how": [
            "<strong>Clause</strong> — le numéro de clause du contrat de service (version " + VERSION + ").",
            "<strong>Objet</strong> — ce que cette clause fait concrètement dans la mission.",
            "<strong>Disposition légale applicable</strong> — la loi, le règlement ou la disposition du code du Commonwealth que la clause met en œuvre.",
        ],
        "instruments_h": "Instruments auxquels ce contrat se réfère",
        "instruments": [
            "<em>Migration Act 1958</em> (Cth)",
            "<em>Migration Regulations 1994</em> (Cth)",
            "<em>Migration Agents Regulations 2026</em> (Cth)",
            "<em>Migration (Migration Agents Code of Conduct) Regulations 2026</em> (Cth) — « le code »",
            "<em>Competition and Consumer Act 2010</em> (Cth), y compris l’Australian Consumer Law (Schedule 2)",
            "<em>Privacy Act 1988</em> (Cth), y compris les Australian Privacy Principles (Schedule 1)",
            "<em>Electronic Transactions Act 1999</em> (Cth) et <em>Copyright Act 1968</em> (Cth)",
        ],
        "table_h": "Correspondance des clauses",
        "th": ("Clause", "Objet", "Disposition légale applicable"),
        "bodies_h": "Qui contacter, et pour quoi",
        "bodies": [
            ("Office of the Migration Agents Registration Authority (OMARA)", "Conduite des agents de migration agréés",
             '<a href="https://www.mara.gov.au/complain/make-a-complaint" target="_blank" rel="noopener">mara.gov.au/complain</a> &middot; 1300 881 995'),
            ("Australian Competition and Consumer Commission (ACCC)", "Garanties consommateur et loyauté commerciale",
             '<a href="https://www.accc.gov.au" target="_blank" rel="noopener">accc.gov.au</a> &middot; 1300 302 502'),
            ("Office of the Australian Information Commissioner (OAIC)", "Vie privée et données personnelles",
             '<a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a> &middot; 1300 363 992'),
        ],
        "th_bodies": ("Organisme", "Ce qu’il couvre", "Contact"),
        "trans_h": "Versions linguistiques",
        "trans": [
            "Cette page est publiée en <strong>anglais, russe et français</strong>. La <strong>version anglaise est le texte faisant foi</strong> : "
            "elle reproduit le contrat tel qu’il a été rédigé en anglais, et c’est le contrat anglais signé qui lie les parties.",
            "Les versions russe et française sont fournies pour la commodité des clients. En cas de divergence de sens avec le texte anglais, "
            "<strong>le texte anglais prévaut</strong>.",
        ],
        "current_h": "Mise à jour de cette page",
        "current": [
            "Le droit australien de l’immigration, le code de conduite et l’Australian Consumer Law évoluent. Ce tableau est revu à chaque révision "
            f"du contrat de service — cette page correspond actuellement à la <strong>version {VERSION}</strong>.",
            'Si vous détenez un exemplaire signé d’une version antérieure du contrat et souhaitez le tableau correspondant, écrivez-nous à '
            '<a href="mailto:info@visa2.au">info@visa2.au</a>.',
        ],
        "related_h": "Pages liées",
        "related": [
            ("Tarifs", "/fr/pricing"),
            ("Contact", "/fr/contact"),
            ("Services de visas", "/fr/visas"),
        ],
        "disclaimer": "Cette page est un récapitulatif d’instruments législatifs publié pour la transparence envers les clients. Elle ne constitue pas un conseil juridique, ne modifie pas le contrat de service et n’exclut ni ne limite aucune garantie consommateur au titre de l’Australian Consumer Law.",
        "lang_links": (("English", "/contract-compliance"), ("Русский", "/ru/contract-compliance"), ("Français", "/fr/contract-compliance")),
        "lang_note": "Le texte anglais fait foi.",
    },
}


def build_main(lang):
    t = T[lang]
    idx = {"en": 1, "ru": 1, "fr": 1}[lang]
    rows = "\n".join(
        f'<tr><td><strong>{c}</strong></td><td>{s[idx]}</td><td>{ref}</td></tr>' for c, s, ref in ROWS
    )
    about = "".join(f"<p>{p}</p>" for p in t["about"])
    how = "".join(f"<li>{p}</li>" for p in t["how"])
    instruments = "".join(f"<li>{i}</li>" for i in t["instruments"])
    trans = "".join(f"<p>{p}</p>" for p in t["trans"])
    current = "".join(f"<p>{p}</p>" for p in t["current"])
    bodies = "\n".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in t["bodies"])
    related = " &middot; ".join(f'<a href="{h}">{n}</a>' for n, h in t["related"])
    langs = " &middot; ".join(
        f'<a href="{h}"{" aria-current=\"page\"" if n == {"en": "English", "ru": "Русский", "fr": "Français"}[lang] else ""}>{n}</a>'
        for n, h in t["lang_links"]
    )
    return f'''<main id="main">  <section class="bg-navy-950 py-16 text-white"> <div class="mx-auto max-w-3xl px-4 lg:px-8"> <p class="font-tech text-xs font-semibold uppercase tracking-wider text-gold-400">{t["eyebrow"]}</p> <h1 class="mt-3 font-display text-4xl font-extrabold">{t["h1a"]}<span class="text-gold-400">{t["h1b"]}</span></h1> <p class="mt-4 text-slate-300">{t["lead"]}</p> <p class="mt-4 font-tech text-xs text-slate-400">{langs} &middot; {t["lang_note"]}</p> </div> </section> <article class="prose-visa mx-auto max-w-3xl px-4 py-14 text-navy-800 lg:px-8 dark:text-slate-200"> <h2>{t["about_h"]}</h2> {about}
<h2>{t["how_h"]}</h2> <ul>{how}</ul>
<h2>{t["instruments_h"]}</h2> <ul>{instruments}</ul>
<h2>{t["table_h"]}</h2>
<div class="not-prose mt-6 overflow-x-auto"><table>
<thead><tr><th>{t["th"][0]}</th><th>{t["th"][1]}</th><th>{t["th"][2]}</th></tr></thead>
<tbody>
{rows}
</tbody></table></div>
<h2>{t["trans_h"]}</h2> {trans}
<h2>{t["bodies_h"]}</h2>
<div class="not-prose mt-6 overflow-x-auto"><table>
<thead><tr><th>{t["th_bodies"][0]}</th><th>{t["th_bodies"][1]}</th><th>{t["th_bodies"][2]}</th></tr></thead>
<tbody>
{bodies}
</tbody></table></div>
<h2>{t["current_h"]}</h2> {current}
<p>{t["related_h"]}: {related}</p>
<p class="text-sm"><em>{t["disclaimer"]}</em></p> </article></main>'''


def head_tags(lang, t):
    canon = {"en": "https://visa2.au/contract-compliance", "ru": "https://visa2.au/ru/contract-compliance",
             "fr": "https://visa2.au/fr/contract-compliance"}[lang]
    alt = ('<link rel="alternate" hreflang="en" href="https://visa2.au/contract-compliance">'
           '<link rel="alternate" hreflang="ru" href="https://visa2.au/ru/contract-compliance">'
           '<link rel="alternate" hreflang="fr" href="https://visa2.au/fr/contract-compliance">'
           f'<link rel="alternate" hreflang="x-default" href="{canon if lang == "en" else "https://visa2.au/contract-compliance"}">')
    return canon, alt


def render(lang):
    t = T[lang]
    donor = open(os.path.join(APP, DONOR[lang]), encoding="utf-8").read()
    canon, alt = head_tags(lang, t)
    m_tag = re.search(r"<title>.*?</title>", donor, re.S)
    open_tag = m_tag.group(0) if m_tag else "<title></title>"
    page = donor.replace(open_tag, f"<title>{t['title']}</title>", 1)
    page = re.sub(r'<meta name="description" content=".*?"', f'<meta name="description" content="{t["desc"]}"', page, count=1, flags=re.S)
    page = re.sub(r'<meta property="og:title" content=".*?"', f'<meta property="og:title" content="{t["title"]}"', page, count=1, flags=re.S)
    page = re.sub(r'<meta property="og:description" content=".*?"', f'<meta property="og:description" content="{t["desc"]}"', page, count=1, flags=re.S)
    page = re.sub(r'<link rel="canonical" href="[^"]*"', f'<link rel="canonical" href="{canon}"', page, count=1)
    page = re.sub(r'<meta property="og:url" content="[^"]*"', f'<meta property="og:url" content="{canon}"', page, count=1)
    page = re.sub(r'(<link rel="alternate" hreflang="[^"]+" href="[^"]+">\s*)+', alt, page, count=1)
    page = re.sub(r"<main id=\"main\">.*?</main>", build_main(lang), page, count=1, flags=re.S)
    # locale pages link to their own twin
    twin = {"en": "/contract-compliance", "ru": "/ru/contract-compliance", "fr": "/fr/contract-compliance"}[lang]
    page = page.replace('href="/contract-compliance"', f'href="{twin}"')
    out = {"en": os.path.join(APP, "contract-compliance.html"),
           "ru": os.path.join(APP, "ru", "contract-compliance.html"),
           "fr": os.path.join(APP, "fr", "contract-compliance.html")}[lang]
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(page)
    print(f"{lang}: {out} ({len(page)} bytes) title={len(t['title'])} desc={len(t['desc'])}")


for lang in ("en", "ru", "fr"):
    render(lang)
