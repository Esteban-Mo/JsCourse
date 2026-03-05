export default {
    id: 8,
    title: 'Expressions Régulières',
    icon: '🔍',
    level: 'Intermédiaire',
    stars: '★★★☆☆',
    content: () => `
      <div class="chapter-tag">Chapitre 08 · Regex</div>
      <h1>Expressions<br><span class="highlight">Régulières</span></h1>

      <div class="chapter-intro-card">
        <div class="level-badge level-intermediate">🔍</div>
        <div class="chapter-meta">
          <div class="difficulty-stars">★★★☆☆</div>
          <h3>Patterns, groupes capturants, validation et extraction de données</h3>
          <p>Durée estimée : 30 min · 3 quizz inclus</p>
        </div>
      </div>

      <p>Une expression régulière (<em>regex</em>) est un motif qui décrit un ensemble de chaînes de caractères. Elle sert à valider, rechercher, extraire ou transformer du texte. C'est un outil universel présent dans tous les langages — et incontournable en JavaScript.</p>

      <h2>Créer une regex</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Syntaxe littérale (recommandée) — compilée au chargement</span>
<span class="kw">const</span> re1 = <span class="op">/</span>bonjour<span class="op">/</span>;
<span class="kw">const</span> re2 = <span class="op">/</span>bonjour<span class="op">/</span>i; <span class="cmt">// flag i = insensible à la casse</span>

<span class="cmt">// Constructeur RegExp — utile si le pattern est dynamique</span>
<span class="kw">const</span> mot = <span class="str">"hello"</span>;
<span class="kw">const</span> re3 = <span class="kw">new</span> <span class="cls">RegExp</span>(mot, <span class="str">"i"</span>); <span class="cmt">// équivalent à /hello/i</span>

<span class="cmt">// Flags principaux</span>
<span class="cmt">// g — global : trouve TOUTES les occurrences (pas seulement la 1ère)</span>
<span class="cmt">// i — insensible à la casse</span>
<span class="cmt">// m — multiline : ^ et $ matchent début/fin de chaque ligne</span>
<span class="cmt">// s — dotAll : . correspond aussi aux sauts de ligne</span></pre>
      </div>

      <h2>Syntaxe des patterns</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Classes de caractères prédéfinies</span>
<span class="op">/</span>\d<span class="op">/</span>    <span class="cmt">// chiffre 0-9</span>
<span class="op">/</span>\D<span class="op">/</span>    <span class="cmt">// non-chiffre</span>
<span class="op">/</span>\w<span class="op">/</span>    <span class="cmt">// caractère de mot : [a-zA-Z0-9_]</span>
<span class="op">/</span>\W<span class="op">/</span>    <span class="cmt">// non-mot</span>
<span class="op">/</span>\s<span class="op">/</span>    <span class="cmt">// espace blanc (espace, tab, newline)</span>
<span class="op">/</span>.<span class="op">/</span>     <span class="cmt">// n'importe quel caractère sauf \n</span>

<span class="cmt">// Classes personnalisées avec crochets</span>
<span class="op">/</span>[aeiou]<span class="op">/</span>    <span class="cmt">// une voyelle</span>
<span class="op">/</span>[a-z]<span class="op">/</span>     <span class="cmt">// une lettre minuscule</span>
<span class="op">/</span>[^0-9]<span class="op">/</span>    <span class="cmt">// tout sauf un chiffre (^ = négation)</span>

<span class="cmt">// Ancres</span>
<span class="op">/</span>^Bonjour<span class="op">/</span>   <span class="cmt">// commence par "Bonjour"</span>
<span class="op">/</span>monde$<span class="op">/</span>    <span class="cmt">// finit par "monde"</span>
<span class="op">/</span>\bJS\b<span class="op">/</span>    <span class="cmt">// mot entier "JS" (word boundary)</span></pre>
      </div>

      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Quantificateurs</span>
<span class="op">/</span>a<span class="op">?/</span>      <span class="cmt">// 0 ou 1 fois</span>
<span class="op">/</span>a<span class="op">*/</span>      <span class="cmt">// 0 ou plusieurs fois</span>
<span class="op">/</span>a<span class="op">+/</span>      <span class="cmt">// 1 ou plusieurs fois</span>
<span class="op">/</span>a{3}<span class="op">/</span>    <span class="cmt">// exactement 3 fois</span>
<span class="op">/</span>a{2,4}<span class="op">/</span>  <span class="cmt">// entre 2 et 4 fois</span>
<span class="op">/</span>a{2,}<span class="op">/</span>   <span class="cmt">// 2 fois ou plus</span>

<span class="cmt">// Greedy vs Lazy (? après le quantificateur)</span>
<span class="kw">const</span> html = <span class="str">"&lt;b&gt;texte&lt;/b&gt;"</span>;
html.<span class="fn">match</span>(<span class="op">/</span>&lt;.*&gt;<span class="op">/</span>);   <span class="cmt">// greedy → "&lt;b&gt;texte&lt;/b&gt;" (capture tout)</span>
html.<span class="fn">match</span>(<span class="op">/</span>&lt;.*?&gt;<span class="op">/</span>);  <span class="cmt">// lazy  → "&lt;b&gt;" (minimum possible)</span></pre>
      </div>

      <h2>Méthodes</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="kw">const</span> str = <span class="str">"JS est super, js aussi !"</span>;

<span class="cmt">// test() — retourne un booléen</span>
<span class="op">/</span>super<span class="op">/</span>.<span class="fn">test</span>(str);  <span class="cmt">// true</span>

<span class="cmt">// match() — premier match (ou tous avec /g)</span>
str.<span class="fn">match</span>(<span class="op">/</span>js<span class="op">/</span>i);   <span class="cmt">// ["JS", index: 0, ...]</span>
str.<span class="fn">match</span>(<span class="op">/</span>js<span class="op">/</span>gi);  <span class="cmt">// ["JS", "js"]</span>

<span class="cmt">// matchAll() — itérateur de TOUS les matches avec groupes</span>
<span class="kw">const</span> matches = [...str.<span class="fn">matchAll</span>(<span class="op">/</span>js<span class="op">/</span>gi)];
<span class="cmt">// → [{0:"JS", index:0}, {0:"js", index:14}]</span>

<span class="cmt">// replace() — remplacer (1ère occurrence sans /g)</span>
str.<span class="fn">replace</span>(<span class="op">/</span>js<span class="op">/</span>gi, <span class="str">"JavaScript"</span>);
<span class="cmt">// → "JavaScript est super, JavaScript aussi !"</span>

<span class="cmt">// search() — index du premier match</span>
str.<span class="fn">search</span>(<span class="op">/</span>super<span class="op">/</span>);  <span class="cmt">// 9</span>

<span class="cmt">// split() avec une regex</span>
<span class="str">"un,deux;trois"</span>.<span class="fn">split</span>(<span class="op">/</span>[,;]<span class="op">/</span>);  <span class="cmt">// ["un", "deux", "trois"]</span></pre>
      </div>

      <h2>Groupes & Captures</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Groupes capturants () — extraire des sous-valeurs</span>
<span class="kw">const</span> date = <span class="str">"2024-03-15"</span>;
<span class="kw">const</span> [, annee, mois, jour] = date.<span class="fn">match</span>(<span class="op">/</span>(\d{4})-(\d{2})-(\d{2})<span class="op">/</span>);
<span class="cmt">// annee = "2024", mois = "03", jour = "15"</span>

<span class="cmt">// Groupes nommés (?&lt;nom&gt;) — ES2018</span>
<span class="kw">const</span> { groups } = date.<span class="fn">match</span>(<span class="op">/</span>(?&lt;a&gt;\d{4})-(?&lt;m&gt;\d{2})-(?&lt;j&gt;\d{2})<span class="op">/</span>);
<span class="cmt">// groups = { a: "2024", m: "03", j: "15" }</span>

<span class="cmt">// Groupes non-capturants (?:) — groupe sans capturer</span>
<span class="op">/</span>(?:https?)<span class="op">/</span>  <span class="cmt">// groupe pour l'alternance, résultat non capturé</span>

<span class="cmt">// Lookahead (?=) — match si suivi de...</span>
<span class="op">/</span>\d+(?=€)<span class="op">/</span>.<span class="fn">exec</span>(<span class="str">"42€"</span>);    <span class="cmt">// ["42"] (sans le €)</span>

<span class="cmt">// Lookbehind (?&lt;=) — match si précédé de...</span>
<span class="op">/</span>(?&lt;=€)\d+<span class="op">/</span>.<span class="fn">exec</span>(<span class="str">"€42"</span>);   <span class="cmt">// ["42"] (sans le €)</span></pre>
      </div>

      <h2>Cas d'usage pratiques</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">javascript</div></div>
        <pre><span class="cmt">// Validation email (simplifiée)</span>
<span class="kw">const</span> emailRe = <span class="op">/</span>^[^\s@]+@[^\s@]+\.[^\s@]+$<span class="op">/</span>;
emailRe.<span class="fn">test</span>(<span class="str">"user@example.com"</span>);  <span class="cmt">// true</span>
emailRe.<span class="fn">test</span>(<span class="str">"invalid@"</span>);           <span class="cmt">// false</span>

<span class="cmt">// Validation mot de passe (≥8 chars, 1 chiffre, 1 majuscule)</span>
<span class="kw">const</span> mdpRe = <span class="op">/</span>^(?=.*\d)(?=.*[A-Z]).{8,}$<span class="op">/</span>;
mdpRe.<span class="fn">test</span>(<span class="str">"Secret42"</span>);  <span class="cmt">// true</span>
mdpRe.<span class="fn">test</span>(<span class="str">"secret"</span>);    <span class="cmt">// false</span>

<span class="cmt">// Extraction de hashtags</span>
<span class="kw">const</span> tweet = <span class="str">"Apprends #JavaScript et #TypeScript !"</span>;
tweet.<span class="fn">match</span>(<span class="op">/</span>#\w+<span class="op">/</span>g);
<span class="cmt">// → ["#JavaScript", "#TypeScript"]</span>

<span class="cmt">// camelCase → kebab-case</span>
<span class="str">"maVariableJS"</span>.<span class="fn">replace</span>(<span class="op">/</span>([A-Z])<span class="op">/</span>g, <span class="str">"-$1"</span>).<span class="fn">toLowerCase</span>();
<span class="cmt">// → "ma-variable-j-s"</span>

<span class="cmt">// Normaliser des numéros de téléphone</span>
<span class="kw">const</span> telRe = <span class="op">/</span>(\d{2})[\s\-]?(\d{2})[\s\-]?(\d{2})[\s\-]?(\d{2})[\s\-]?(\d{2})<span class="op">/</span>;
<span class="str">"06 12 34 56 78"</span>.<span class="fn">replace</span>(telRe, <span class="str">"$1.$2.$3.$4.$5"</span>);
<span class="cmt">// → "06.12.34.56.78"</span></pre>
      </div>

      <div class="info-box tip">
        <div class="info-icon">💡</div>
        <p>Pour tester et visualiser tes regex en temps réel, utilise <strong>regex101.com</strong> — il affiche les groupes capturés, explique chaque partie du pattern, et propose des alternatives. Indispensable pour les regex complexes.</p>
      </div>

      <div class="challenge-block">
        <div class="challenge-title">⚡ DÉFI PRATIQUE</div>
        <p style="color:#a0a0c0;font-size:14px">Sans exécuter, prédis le résultat de chaque expression :</p>
        <pre><span class="kw">const</span> s = <span class="str">"abc 123 def 456"</span>;
console.<span class="fn">log</span>(s.<span class="fn">match</span>(<span class="op">/</span>\d+<span class="op">/</span>));    <span class="cmt">// ?</span>
console.<span class="fn">log</span>(s.<span class="fn">match</span>(<span class="op">/</span>\d+<span class="op">/</span>g));   <span class="cmt">// ?</span>
console.<span class="fn">log</span>(<span class="op">/</span>^\d<span class="op">/</span>.<span class="fn">test</span>(s));     <span class="cmt">// ?</span>
console.<span class="fn">log</span>(s.<span class="fn">replace</span>(<span class="op">/</span>\d+<span class="op">/</span>g, <span class="str">"X"</span>)); <span class="cmt">// ?</span>

<span class="cmt">// Extraire l'année depuis "Publié le 2024-03-15"</span>
<span class="kw">const</span> msg = <span class="str">"Publié le 2024-03-15"</span>;
<span class="kw">const</span> [, annee] = msg.<span class="fn">match</span>(<span class="op">/</span>(\d{4})<span class="op">/</span>); <span class="cmt">// ?</span></pre>
      </div>
    `,
    quiz: [
      {
        question: "Quelle est la différence entre /\\d+/ et /^\\d+$/ ?",
        sub: "Rôle des ancres ^ et $",
        options: [
          "Aucune différence",
          "/\\d+/ trouve des chiffres n'importe où dans la chaîne, /^\\d+$/ exige que TOUTE la chaîne soit des chiffres",
          "/^\\d+$/ trouve plusieurs occurrences",
          "^ et $ signifient 'début de chiffre' et 'fin de chiffre'"
        ],
        correct: 1,
        explanation: "✅ Exact ! /\\d+/ matcherait '42' dans 'abc42def'. /^\\d+$/ n'accepte que les chaînes composées uniquement de chiffres. ^ ancre au début, $ ancre à la fin — ensemble ils forcent le match sur la chaîne entière. Indispensable pour la validation."
      },
      {
        question: "Que retourne 'JS est super'.match(/\\w+/g) ?",
        sub: "Le flag /g et match()",
        options: [
          "['JS']",
          "null",
          "['JS', 'est', 'super']",
          "['JS est super']"
        ],
        correct: 2,
        explanation: "✅ Exact ! Avec le flag g, match() retourne un tableau de TOUTES les occurrences. \\w+ correspond à un ou plusieurs caractères de mot (lettres, chiffres, _). Les espaces ne matchent pas \\w, donc la phrase est découpée en 3 mots."
      },
      {
        question: "Quelle est la différence entre un groupe capturant () et non-capturant (?:) ?",
        sub: "Groupes dans les regex",
        options: [
          "() est plus lent que (?:)",
          "() capture la valeur dans les résultats, (?:) groupe sans capturer",
          "(?:) est une négation",
          "Il n'y a pas de différence fonctionnelle"
        ],
        correct: 1,
        explanation: "✅ Exact ! () capture le contenu et le rend accessible dans match()/exec() comme groupe numéroté (ou nommé avec ?<nom>). (?:) groupe des parties du pattern pour les quantificateurs ou alternatives, sans capturer. Utilise (?:) quand tu n'as pas besoin de la valeur — légèrement plus performant."
      }
    ]
};
