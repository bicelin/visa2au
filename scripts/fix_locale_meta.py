#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bring the hand-written RU/FR twins inside the SERP limits.

`build_locale_pages.py` does not regenerate these pages (it SKIPs them for too
few translation keys), so their titles and descriptions are literal in the HTML and
can be edited directly. English is never touched here.

Title <= 60 chars, description <= 160 chars, and og:title / og:description are
kept identical to the visible title/description so the next locale build and
`align_seo_meta.py` cannot reintroduce a longer variant from a stale og tag.
"""
import os
import re

APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")

META = {
    # ── Russian ────────────────────────────────────────────────────────────────
    "ru/visas/skills-assessment.html": (
        "Подтверждение квалификации: VETASSESS · TRA · EA · ACS",
        "Как проходит подтверждение квалификации для миграции: VETASSESS, TRA, EA и ACS, требования, документы и сроки — от агентов MARN."),
    "ru/visas/australian-citizenship.html": (
        "Гражданство Австралии: conferral и descent",
        "Гражданство Австралии по naturalisation и descent: требования, тест, документы и сроки — помощь зарегистрированных агентов MARN."),
    "ru/visas/skilled-independent-189-190.html": (
        "Независимая и номинируемая штатом 189/190",
        "Визы 189 и 190: балльный тест, требования, номинация штата и сроки. Как набрать баллы и получить приглашение — от агентов MARN."),
    "ru/visas/employer-nomination-186.html": (
        "Схема номинации работодателя (ENS) 186",
        "Виза 186 (ENS): прямое и поэтапное спонсорство, требования, возраст и сроки. Что нужно работодателю и вам — от агентов MARN."),
    "ru/visas/training-visa-407.html": (
        "Виза профессионального обучения 407",
        "Виза 407: обучение и стажировка у австралийского спонсора, требования, сроки и переход к другим визам — от агентов MARN."),
    "ru/visas/visa-refusals-art-appeals.html": (
        "Отказы в визе и апелляции в ART",
        "Отказ в визе: сроки обжалования в ART, merits review, ministerial intervention и повторная подача — от агентов MARN."),
    "ru/visas/partner-visa-309-100.html": (
        "Виза партнёра (оффшор) 309/100",
        "Оффшорная партнёрская виза 309/100: доказательства отношений, двухэтапный процесс, сроки и документы — от агентов MARN."),
    "ru/visas/parent-visa-103.html": (
        "Родительские визы 103/143/870",
        "Родительские визы 103, 143 и 870: очереди, платные варианты, спонсорство и сроки — сравнение от зарегистрированных агентов MARN."),
    "ru/visas/skilled-regional-494.html": (
        "Региональная спонсируемая виза 494",
        "Виза 494: региональное спонсорство, уступки DAMA, требования и путь к ПМЖ через 191 — от агентов MARN."),
    "ru/visas/work-holiday-417-462.html": (
        "Визы «работа и отдых» 417/462",
        "Визы 417 и 462: требования, работа в регионе, продление и второй год — практический разбор от агентов MARN."),
    "ru/visas/prospective-marriage-300.html": (
        "Виза жениха или невесты 300",
        "Виза 300: помолвка, сроки, требования и переход на партнёрскую визу 820/801 после свадьбы — от агентов MARN."),
    "ru/visas/partner-visa-820-801.html": (
        "Партнёрская виза 820/801",
        "Партнёрская виза 820/801: доказательства отношений, двухэтапный процесс и сроки — практическое руководство от агентов MARN."),
    "ru/visas/bridging-visas.html": (
        "Бриджинг-визы BVA–BVE",
        "Бриджинг-визы A, B, C, D и E: когда действуют, право на работу и выезд, сроки — от зарегистрированных агентов MARN."),
    "ru/visas/student-visa-500.html": (
        "Студенческая виза 500",
        "Студенческая виза 500: зачисление, финансовые требования, GTE и продление — практическое руководство от агентов MARN."),
    "ru/visas/visitor-visa-600.html": (
        "Гостевая виза 600",
        "Гостевая виза 600: цели поездки, финансы, приглашения и частые причины отказа — от зарегистрированных агентов MARN."),
    "ru/urgent-visa-help.html": (
        "Срочная помощь: s56, отказы, аннулирование",
        "Запрос s56, отказ или аннулирование визы? Сроки 7–28 дней не продлеваются. Что делать сразу — от агентов MARN."),
    "ru/index.html": (
        "Visa2AU — иммиграция в Австралию и визы",
        "Агенты MARN 0534230: 2000+ кейсов и 99,8% успеха. Рабочие, партнёрские, студенческие и семейные визы — фиксированная стоимость."),
    "ru/blog.html": (
        "Блог Visa2AU — гайды по иммиграции",
        "Практические гайды по иммиграции в Австралию от агентов MARN: партнёрские визы, профессиональная миграция, спонсорство и гражданство."),
    # ── French ───────────────────────────────────────────────────────────────
    "fr/visas/skills-assessment.html": (
        "Évaluation des compétences : VETASSESS · TRA · EA · ACS",
        "Comment se passe l’évaluation des compétences : VETASSESS, TRA, EA et ACS, exigences, documents et délais, expliqués par des agents MARN."),
    "fr/visas/australian-citizenship.html": (
        "Citoyenneté australienne : conferral et descent",
        "Citoyenneté australienne par naturalisation et descent : conditions, test, documents et délais, avec l’aide d’agents MARN agréés."),
    "fr/visas/skilled-independent-189-190.html": (
        "Indépendant &amp; nominé par un État 189/190",
        "Visas 189 et 190 : test de points, conditions, nomination d’un État et délais. Comment maximiser vos points, avec des agents MARN."),
    "fr/visas/employer-nomination-186.html": (
        "Nomination par l’employeur (ENS) 186",
        "Visa 186 (ENS) : parrainage direct ou par étapes, conditions, âge et délais. Ce qu’il faut à l’employeur et à vous, avec des agents MARN."),
    "fr/visas/visa-refusals-art-appeals.html": (
        "Refus de visa &amp; recours ART",
        "Refus de visa : délais de recours devant l’ART, merits review, intervention ministérielle et nouvelle demande, avec des agents MARN."),
    "fr/visas/partner-visa-309-100.html": (
        "Visa partenaire (offshore) 309/100",
        "Visa partenaire offshore 309/100 : preuves de la relation, processus en deux étapes, délais et documents, avec des agents MARN."),
    "fr/visas/training-visa-407.html": (
        "Visa formation professionnelle 407",
        "Visa 407 : formation ou stage chez un sponsor australien, conditions, délais et passage vers un autre visa, avec des agents MARN."),
    "fr/visas/work-holiday-417-462.html": (
        "Visas vacances-travail 417/462",
        "Visas 417 et 462 : conditions, travail en région, prolongation et deuxième année, expliqués par des agents de migration MARN."),
    "fr/visas/bridging-visas.html": (
        "Visas de transition BVA–BVE",
        "Visas de transition A, B, C, D et E : quand ils s’appliquent, droit au travail et aux voyages, délais, avec des agents MARN."),
    "fr/visas/skilled-regional-494.html": (
        "Visa régional parrainé 494",
        "Visa 494 : parrainage régional, concessions DAMA, conditions et accès à la résidence via le 191, avec des agents MARN."),
    "fr/visas/parent-visa-103.html": (
        "Visas parents 103/143/870",
        "Visas parents 103, 143 et 870 : files d’attente, options payantes, parrainage et délais comparés, avec des agents MARN."),
    "fr/visas/partner-visa-820-801.html": (
        "Visas partenaires 820/801",
        "Visa partenaire 820/801 : preuves de la relation, processus en deux étapes et délais, guide pratique par des agents MARN."),
    "fr/visas/prospective-marriage-300.html": (
        "Visa mariage projeté 300",
        "Visa 300 : fiançailles, délais, conditions et passage au visa partenaire 820/801 après le mariage, avec des agents MARN."),
    "fr/visas/student-visa-500.html": (
        "Visa étudiant 500",
        "Visa étudiant 500 : inscription, exigences financières, GTE et prolongation, guide pratique par des agents de migration MARN."),
    "fr/visas/visitor-visa-600.html": (
        "Visa visiteur 600",
        "Visa visiteur 600 : motif du séjour, finances, invitations et motifs de refus fréquents, avec des agents de migration MARN."),
    "fr/index.html": (
        "Visa2AU — immigration australienne &amp; visas",
        "Agents agréés (MARN 0534230) : 2 000+ dossiers et 99,8 % de réussite. Visas qualifiés, partenaires, employeurs et familles — honoraires fixes."),
    "fr/blog.html": (
        "Blog Visa2AU — guides immigration",
        "Guides pratiques sur l’immigration australienne par des agents MARN : visas partenaires, migration qualifiée, parrainage employeur et citoyenneté."),
    "fr/urgent-visa-help.html": (
        "Aide visa urgente : s56, refus, annulation",
        "Demande s56, refus ou avis d’annulation ? Les délais sont stricts (7–28 jours) et non prolongeables. Voici quoi faire, avec des agents MARN."),
    # ── description-only fixes (pages build_locale_pages never regenerates) ────
    "ru/migration-agent-brisbane.html": (None,
        "Зарегистрированный агент в Брисбене: Квинсленд и вся Австралия — и весь мир по защищённой видеосвязи. Skilled, Partner, Family."),
    "ru/migration-agent-cairns.html": (None,
        "Зарегистрированный агент в Кэрнсе (MARN 0534230): Дальний Север Квинсленда и вся Австралия — и мир по защищённой видеосвязи."),
    "ru/migration-agent-melbourne.html": (None,
        "Зарегистрированный агент в Мельбурне (MARN 2418663): Виктория и вся Австралия — и мир по защищённой видеосвязи. Фиксированные гонорары."),
    "ru/migration-agent-sydney.html": (None,
        "Зарегистрированные агенты в Сиднее (MARN 0534230/2418663): офис в North Sydney, NSW и вся Австралия, и мир по видеосвязи."),
    "ru/video.html": (None,
        "Подключитесь к видеоконсультации Visa2AU: введите имя и код доступа, который вам выдали. Консультации записываются для качества."),
    "fr/migration-agent-brisbane.html": (None,
        "Agent de migration enregistré à Brisbane, au service du Queensland et de toute l’Australie — et du monde entier par consultation vidéo sécurisée."),
    "fr/migration-agent-cairns.html": (None,
        "Agent enregistré à Cairns (MARN 0534230) pour le Far North Queensland et toute l’Australie — et le monde entier par vidéo sécurisée."),
    "fr/migration-agent-melbourne.html": (None,
        "Agent enregistré à Melbourne (MARN 2418663) au service de la Victoria et de toute l’Australie — et du monde entier par vidéo sécurisée."),
    "fr/migration-agent-sydney.html": (None,
        "Agents enregistrés à Sydney (MARN 0534230/2418663), siège à North Sydney, au service de la NSW et de toute l’Australie."),
    "fr/video.html": (None,
        "Rejoignez votre consultation vidéo Visa2AU : entrez votre nom et le code d’accès fourni. Les consultations sont enregistrées pour la qualité."),
}


def main():
    problems = []
    for rel, (title, desc) in META.items():
        if title is not None and len(title) > 60:
            problems.append(f"{rel}: title {len(title)}")
        if len(desc) > 160:
            problems.append(f"{rel}: desc {len(desc)}")
    if problems:
        print("REFUSED — over the limits:")
        for p in problems:
            print(" -", p)
        return 1

    changed = 0
    for rel, (title, desc) in META.items():
        path = os.path.join(APP, rel)
        html = open(path, encoding="utf-8").read()
        new = html
        if title is not None:
            new = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", new, count=1, flags=re.S)
            new = re.sub(r'(<meta property="og:title" content=")[^"]*(")',
                         lambda m: m.group(1) + title + m.group(2), new, count=1)
        new = re.sub(r'(<meta name="description" content=")[^"]*(")',
                     lambda m: m.group(1) + desc + m.group(2), new, count=1)
        new = re.sub(r'(<meta property="og:description" content=")[^"]*(")',
                     lambda m: m.group(1) + desc + m.group(2), new, count=1)
        if new != html:
            open(path, "w", encoding="utf-8").write(new)
            changed += 1
    print(f"pages updated: {changed} of {len(META)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
