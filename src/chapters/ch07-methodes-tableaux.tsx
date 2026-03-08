import { CodeBlock, InfoBox, Challenge } from '../components/content';
import type { Chapter } from '../types';

function Ch21() {
  return (
    <>
      <div className="chapter-tag">Intermédiaire</div>
      <div className="chapter-intro-card">
        <div className="level-badge level-intermediate">🧰</div>
        <div className="chapter-meta">
          <div className="difficulty-stars">★★★☆☆</div>
          <h3>Méthodes de tableaux</h3>
          <p>map, filter, reduce et toutes les méthodes fonctionnelles essentielles</p>
        </div>
      </div>

      <h2>La philosophie fonctionnelle — pourquoi ces méthodes existent</h2>
      <p>
        Avant d'entrer dans le détail de chaque méthode, il faut comprendre <em>pourquoi</em> elles ont été conçues ainsi.
        Pendant longtemps, pour traiter un tableau en JavaScript, on écrivait des boucles <code>for</code> impératives :
        on disait à la machine <em>comment</em> faire — "parcours l'index i de 0 à la longueur, accède à l'élément, fais un push dans un autre tableau...".
        C'est verbeux, source de bugs (indice hors bornes, oubli d'initialiser le tableau résultat, mutation accidentelle).
      </p>
      <p>
        La <strong>programmation fonctionnelle</strong> adopte une autre approche : on décrit <em>ce qu'on veut</em>, pas
        comment le faire. Au lieu de "parcours chaque élément et pousse son double dans un nouveau tableau", on dit
        "transforme chaque élément en le multipliant par 2". C'est le rôle de <code>map()</code>, <code>filter()</code>,
        <code>reduce()</code> et leurs cousines. Le moteur JavaScript s'occupe de la boucle ; toi, tu te concentres sur la logique.
      </p>
      <p>
        Ces méthodes partagent toutes une caractéristique fondamentale : elles ne modifient jamais le tableau d'origine.
        Elles retournent toujours un <strong>nouveau tableau</strong> (ou une nouvelle valeur). C'est ce qu'on appelle
        l'<strong>immuabilité</strong> — une propriété qui rend le code plus prévisible et plus facile à déboguer.
      </p>
      <InfoBox type="tip">
        Une règle d'or : si tu te retrouves à écrire <code>const résultat = [];</code> suivi d'un
        <code>for</code> avec un <code>push()</code> à l'intérieur, demande-toi si <code>map()</code>,
        <code>filter()</code> ou <code>reduce()</code> ne feraient pas le même travail en une seule ligne.
        La réponse est presque toujours oui.
      </InfoBox>

      <h2>map() — une chaîne de montage pour tes données</h2>
      <p>
        Imagine une usine avec une chaîne de montage. Chaque pièce (élément du tableau) passe devant un
        ouvrier (ta fonction), qui la transforme — peinture, assemblage, emballage — et la dépose sur le
        tapis suivant. À la fin, tu as un nouveau tapis avec autant de pièces qu'au départ, mais toutes transformées.
        C'est exactement ce que fait <code>map()</code>.
      </p>
      <p>
        <code>map()</code> crée un <strong>nouveau tableau de même longueur</strong> en appliquant une fonction
        de transformation à chaque élément. La fonction reçoit trois arguments : l'élément courant, son index,
        et le tableau entier — mais dans 90 % des cas, on n'utilise que le premier.
      </p>
      <CodeBlock language="javascript">{`const prix = [10, 20, 30, 40];

// Appliquer une TVA de 20%
const prixTTC = prix.map(p => p * 1.2);
console.log(prixTTC); // [12, 24, 36, 48]
console.log(prix);    // [10, 20, 30, 40] — inchangé !

// Transformer un tableau d'objets
const users = [
  { nom: 'Alice', age: 25 },
  { nom: 'Bob',   age: 30 },
];
const noms = users.map(u => u.nom);
console.log(noms); // ['Alice', 'Bob']

// map() avec index — utile pour numéroter
const indexés = ['a', 'b', 'c'].map((val, i) => \`\${i + 1}. \${val}\`);
console.log(indexés); // ['1. a', '2. b', '3. c']

// Transformer des objets entiers
const usersAvecRole = users.map(u => ({ ...u, role: 'visiteur' }));
// [{ nom: 'Alice', age: 25, role: 'visiteur' }, ...]`}</CodeBlock>
      <p>
        Remarque la ligne <code>console.log(prix)</code> après le <code>map()</code> : le tableau original est
        intact. <code>map()</code> ne touche jamais à la source. Si ta fonction de transformation ne retourne
        rien (oubli du <code>return</code> dans une fonction à accolades), chaque élément sera remplacé par
        <code>undefined</code> — c'est un piège fréquent.
      </p>
      <InfoBox type="warning">
        Avec la syntaxe fléchée à accolades, le <code>return</code> est obligatoire. Sans accolades, le
        retour est implicite. <code>arr.map(x ={'>'} x * 2)</code> fonctionne. <code>arr.map(x ={'>'} {'{'} x * 2 {'}'})</code> retourne
        <code>undefined</code> pour chaque élément — n'oublie pas le <code>return</code> dès que tu ouvres des accolades.
      </InfoBox>

      <h2>filter() — le gardien de la porte</h2>
      <p>
        <code>filter()</code> fonctionne comme un videur de boîte de nuit avec une liste d'invités. Chaque
        élément du tableau passe devant lui ; si la condition est <code>true</code>, il entre dans le
        nouveau tableau. Sinon, il est renvoyé. Le résultat est un tableau de même type, mais potentiellement
        plus court — il contient uniquement ceux qui ont "passé le test".
      </p>
      <p>
        La fonction passée à <code>filter()</code> s'appelle un <strong>prédicat</strong> : c'est une fonction
        qui prend un élément et retourne un booléen (<code>true</code> ou <code>false</code>). JavaScript est
        souple : tout ce qui est "truthy" (nombre non nul, string non vide, objet...) compte comme <code>true</code>,
        ce qui permet l'astuce <code>filter(Boolean)</code> pour retirer les valeurs falsy.
      </p>
      <CodeBlock language="javascript">{`const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pairs = nombres.filter(n => n % 2 === 0);
console.log(pairs); // [2, 4, 6, 8, 10]

// Filtrer des objets — très courant en pratique
const produits = [
  { nom: 'Stylo',    stock: 0 },
  { nom: 'Cahier',   stock: 5 },
  { nom: 'Règle',    stock: 0 },
  { nom: 'Classeur', stock: 2 },
];

const disponibles = produits.filter(p => p.stock > 0);
// [{ nom: 'Cahier', stock: 5 }, { nom: 'Classeur', stock: 2 }]
// 'Stylo' et 'Règle' ont été exclus car leur stock vaut 0

// Retirer les valeurs falsy (Boolean est une fonction !)
// Boolean(0) → false, Boolean(null) → false, Boolean(1) → true...
const données = [0, 1, null, 2, '', 3, undefined, 4];
const propres = données.filter(Boolean);
console.log(propres); // [1, 2, 3, 4]

// Dédoublonner (simple, pour les primitives)
const avecDoublons = [1, 2, 2, 3, 3, 3];
const unique = avecDoublons.filter((val, i, arr) => arr.indexOf(val) === i);
// [1, 2, 3] — on garde un élément seulement si c'est sa PREMIÈRE occurrence`}</CodeBlock>
      <p>
        La dernière astuce de dédoublonnage mérite une explication : <code>arr.indexOf(val)</code> retourne
        toujours l'index de la <em>première</em> occurrence. Si l'index courant <code>i</code> est différent
        de cet index, c'est un doublon — on le rejette. C'est élégant mais pas optimal pour les grands tableaux
        (O(n²)). Pour les grands jeux de données, préfère <code>new Set()</code>.
      </p>

      <h2>reduce() — l'outil universel</h2>
      <p>
        <code>reduce()</code> est la méthode la plus puissante et la plus mal comprise de toutes. Elle peut
        remplacer <code>map()</code> et <code>filter()</code>, construire des objets, aplatir des tableaux,
        calculer des statistiques. Sa puissance vient d'un concept simple : l'<strong>accumulateur</strong>.
      </p>
      <p>
        Imagine que tu comptes des billets de banque. Tu commences avec 0€ dans la main (la valeur initiale).
        Tu prends le premier billet, tu l'ajoutes à ta main (l'accumulation). Ta main contient maintenant 10€.
        Tu prends le deuxième billet — ta main, avec ses 10€, reçoit encore 20€, et devient 30€. Et ainsi de
        suite jusqu'à la fin. À la fin, ta main contient le total. C'est exactement la mécanique de
        <code>reduce(acc, valeur) =&gt; nouvelAcc</code>.
      </p>
      <CodeBlock language="javascript">{`const notes = [14, 18, 12, 16, 10];

// Voyons reduce() pas à pas :
// Valeur initiale de acc : 0
// Itération 1 : acc=0,  note=14 → acc devient 0+14  = 14
// Itération 2 : acc=14, note=18 → acc devient 14+18 = 32
// Itération 3 : acc=32, note=12 → acc devient 32+12 = 44
// Itération 4 : acc=44, note=16 → acc devient 44+16 = 60
// Itération 5 : acc=60, note=10 → acc devient 60+10 = 70
// Résultat final : 70
const total = notes.reduce((acc, note) => acc + note, 0);
console.log(total); // 70

const moyenne = total / notes.length; // 14

// reduce() peut aussi construire un OBJET (l'accumulateur n'est pas forcément un nombre)
const animaux = ['chat', 'chien', 'chat', 'lapin', 'chien', 'chat'];
const comptage = animaux.reduce((acc, animal) => {
  // acc est un objet { chat: 2, chien: 1 } etc.
  // acc[animal] vaut undefined si l'animal n'a pas encore été vu → on utilise || 0
  acc[animal] = (acc[animal] || 0) + 1;
  return acc; // IMPORTANT : toujours retourner l'accumulateur !
}, {}); // valeur initiale : un objet vide
// Résultat : { chat: 3, chien: 2, lapin: 1 }

// Aplatir un tableau de tableaux (avant flat() — ES2019)
const matrice = [[1, 2], [3, 4], [5, 6]];
const plat = matrice.reduce((acc, arr) => acc.concat(arr), []);
// [1, 2, 3, 4, 5, 6]

// Trouver le maximum
const max = notes.reduce((acc, n) => n > acc ? n : acc, -Infinity);
// 18`}</CodeBlock>
      <InfoBox type="danger">
        Deux erreurs critiques avec <code>reduce()</code> : (1) oublier le <code>return acc</code> à la fin
        de la fonction — l'accumulateur devient <code>undefined</code> dès la deuxième itération. (2) ne pas
        fournir la valeur initiale sur un tableau vide — JavaScript lève une <code>TypeError</code> car il n'y
        a rien à retourner. Prends l'habitude de toujours passer la valeur initiale, même si c'est <code>0</code> ou <code>[]</code>.
      </InfoBox>
      <InfoBox type="tip">
        Une astuce mnémotechnique : le nom "reduce" vient du fait qu'on "réduit" un tableau à une valeur
        unique. Mais cette valeur peut être n'importe quoi — un nombre, un objet, un autre tableau, même une
        fonction. C'est pour ça que <code>reduce()</code> est si universel.
      </InfoBox>

      <h2>find() et findIndex() — chercher sans tout parcourir</h2>
      <p>
        <code>filter()</code> parcourt <em>tout</em> le tableau et retourne tous les éléments correspondants.
        Mais parfois tu ne veux que le <em>premier</em> résultat, et tu veux t'arrêter dès que tu l'as trouvé
        pour ne pas gaspiller du temps de calcul. C'est le rôle de <code>find()</code> et <code>findIndex()</code>.
      </p>
      <p>
        Pense à chercher tes clés dans la maison. Tu cherches pièce par pièce — dès que tu les trouves, tu
        t'arrêtes. Tu ne fouilles pas toutes les pièces restantes. <code>find()</code> fonctionne pareil :
        dès que la condition est vraie pour un élément, il retourne cet élément et arrête le parcours.
      </p>
      <CodeBlock language="javascript">{`const utilisateurs = [
  { id: 1, nom: 'Alice', admin: false },
  { id: 2, nom: 'Bob',   admin: true  },
  { id: 3, nom: 'Carol', admin: true  },
];

// find() — retourne l'ÉLÉMENT (ou undefined si absent)
const premierAdmin = utilisateurs.find(u => u.admin);
// { id: 2, nom: 'Bob', admin: true }
// Note : Carol est aussi admin, mais find() s'arrête au premier !

// findIndex() — retourne l'INDEX (ou -1 si absent)
const indexBob = utilisateurs.findIndex(u => u.nom === 'Bob');
// 1

// Retourne undefined / -1 si non trouvé
const inconnu = utilisateurs.find(u => u.nom === 'Dave');
// undefined → toujours vérifier le résultat avant de l'utiliser !

// Mise à jour d'un élément par id (pattern courant)
const userId = 2;
const index = utilisateurs.findIndex(u => u.id === userId);
if (index !== -1) {
  // On crée une copie pour ne pas muter l'original
  const mis_à_jour = [...utilisateurs];
  mis_à_jour[index] = { ...utilisateurs[index], admin: false };
}`}</CodeBlock>
      <p>
        La différence entre <code>find()</code> et <code>filter()</code> : <code>find()</code> retourne
        un <em>élément</em> (ou <code>undefined</code>), <code>filter()</code> retourne toujours un
        <em>tableau</em> (potentiellement vide). Pour chercher un élément unique par son identifiant,
        <code>find()</code> est le bon outil.
      </p>

      <h2>some() et every() — questions sur l'ensemble</h2>
      <p>
        Ces deux méthodes répondent à des questions sur le tableau entier et retournent un simple
        <strong>booléen</strong>. Elles exploitent le <em>court-circuit</em> (short-circuit) pour être
        efficaces : dès que le résultat est déterminé, elles s'arrêtent de parcourir le tableau.
      </p>
      <p>
        <strong><code>some()</code></strong> : "Est-ce qu'au moins un élément satisfait la condition ?" —
        Dès qu'un élément la satisfait, la réponse est <code>true</code> et on s'arrête. Si aucun
        n'est trouvé après avoir tout parcouru, c'est <code>false</code>. C'est une porte OU logique.
      </p>
      <p>
        <strong><code>every()</code></strong> : "Est-ce que tous les éléments satisfont la condition ?" —
        Dès qu'un élément la viole, la réponse est <code>false</code> et on s'arrête. Si tous passent le
        test, c'est <code>true</code>. C'est une porte ET logique.
      </p>
      <CodeBlock language="javascript">{`const ages = [22, 16, 30, 17, 28];

// some() : suffit qu'UN SEUL soit mineur
const unMineur = ages.some(age => age < 18);
console.log(unMineur); // true (16 et 17 satisfont la condition)
// → arrêt dès l'index 1 (age=16), sans regarder 30, 17, 28

// every() : TOUS doivent être majeurs
const tousMajeurs = ages.every(age => age >= 18);
console.log(tousMajeurs); // false
// → arrêt dès l'index 1 (16 < 18), sans regarder la suite

// Cas pratiques — formulaire de commande
const panier = [
  { nom: 'Pizza',   dispo: true  },
  { nom: 'Sushi',   dispo: false },
  { nom: 'Burger',  dispo: true  },
];

// Peut-on valider toute la commande ?
const commandable = panier.every(p => p.dispo);   // false — Sushi indispo
// Y a-t-il au moins un article disponible ?
const partielle   = panier.some(p => p.dispo);    // true

// Vérifier qu'un tableau n'est pas vide et que tous les champs sont remplis
const formulaire = { nom: 'Alice', email: 'alice@test.com', message: '' };
const champs = Object.values(formulaire);
const valide = champs.every(v => v.trim().length > 0); // false (message vide)

// Cas notable : some([]) → false, every([]) → true (vide satisfait vacuement)
[].some(x => x > 0);  // false
[].every(x => x > 0); // true (aucun contre-exemple !)`}</CodeBlock>
      <InfoBox type="tip">
        <code>some()</code> et <code>every()</code> sont souvent plus lisibles qu'un <code>filter().length {'>'} 0</code>.
        Préfère <code>arr.some(x ={'>'} x {'>'} 0)</code> à <code>arr.filter(x ={'>'} x {'>'} 0).length {'>'} 0</code> —
        c'est plus court, plus expressif, et plus efficace (short-circuit).
      </InfoBox>

      <h2>flat() et flatMap() — aplatir les structures imbriquées</h2>
      <p>
        Les données réelles sont rarement des tableaux plats. Une API peut te renvoyer un tableau
        de résultats, où chaque résultat contient lui-même un tableau de sous-éléments. <code>flat()</code>
        permet d'aplatir ces structures imbriquées en un tableau uni-dimensionnel.
      </p>
      <p>
        <code>flatMap()</code> est une combinaison atomique de <code>map()</code> suivi de <code>flat(1)</code>.
        Il est particulièrement utile quand ta transformation produit plusieurs éléments par entrée — par
        exemple, découper chaque phrase en ses mots individuels.
      </p>
      <CodeBlock language="javascript">{`// flat() avec différentes profondeurs
const nested = [1, [2, 3], [4, [5, 6]]];

nested.flat();         // [1, 2, 3, 4, [5, 6]] — profondeur 1 par défaut
nested.flat(2);        // [1, 2, 3, 4, 5, 6]   — profondeur 2
nested.flat(Infinity); // [1, 2, 3, 4, 5, 6]   — aplatit tout, quelle que soit la profondeur

// Cas pratique : données API paginées
const pagesDePosts = [
  [{ id: 1, titre: 'Post A' }, { id: 2, titre: 'Post B' }],
  [{ id: 3, titre: 'Post C' }],
  [{ id: 4, titre: 'Post D' }, { id: 5, titre: 'Post E' }],
];
const tousPosts = pagesDePosts.flat();
// [{id:1,...}, {id:2,...}, {id:3,...}, {id:4,...}, {id:5,...}]

// flatMap() — transformer ET aplatir en une passe
const phrases = ['Bonjour monde', 'Hello world'];

// Avec map() seul → tableau de tableaux :
phrases.map(p => p.split(' ')); // [['Bonjour', 'monde'], ['Hello', 'world']]

// Avec flatMap() → tableau plat de mots :
const mots = phrases.flatMap(p => p.split(' '));
// ['Bonjour', 'monde', 'Hello', 'world']

// flatMap() peut aussi filtrer en retournant [] pour ignorer un élément
const nombres = [1, 2, 3, 4, 5];
const doublés_pairs = nombres.flatMap(n => n % 2 === 0 ? [n * 2] : []);
// [4, 8] — pairs seulement, doublés`}</CodeBlock>
      <p>
        La dernière astuce mérite qu'on s'y arrête : <code>flatMap(n =&gt; n % 2 === 0 ? [n * 2] : [])</code>
        combine en une seule passe ce qu'on ferait normalement avec <code>.filter().map()</code>. En retournant
        un tableau vide <code>[]</code> pour les éléments à ignorer, on les "supprime" de la sortie.
        C'est un pattern puissant pour les transformations qui impliquent à la fois sélection et transformation.
      </p>

      <h2>sort() — un comportement surprenant qu'il faut comprendre</h2>
      <p>
        <code>sort()</code> est probablement la méthode qui surprend le plus les développeurs. Son comportement
        par défaut est contre-intuitif : il trie les éléments en les convertissant d'abord en chaînes de
        caractères, puis en les comparant selon l'ordre des <strong>points de code Unicode</strong>.
      </p>
      <p>
        Pourquoi ce choix ? JavaScript a été conçu à l'origine comme un langage pour manipuler du texte sur
        le web. Le tri de chaînes étant plus universel que le tri de nombres, c'est ce comportement qui a été
        choisi par défaut. Mais dès qu'on travaille avec des nombres, il faut impérativement fournir une
        <strong>fonction de comparaison</strong>.
      </p>
      <p>
        La fonction de comparaison reçoit deux éléments <code>a</code> et <code>b</code> et doit retourner :
        un nombre <strong>négatif</strong> si <code>a</code> doit passer avant <code>b</code>,
        <strong>zéro</strong> s'ils sont équivalents,
        un nombre <strong>positif</strong> si <code>b</code> doit passer avant <code>a</code>.
        L'astuce <code>a - b</code> exploite exactement ce contrat pour les nombres.
      </p>
      <CodeBlock language="javascript">{`// ❌ Piège classique — tri de nombres sans fonction de comparaison
[10, 1, 21, 2].sort();
// → [1, 10, 2, 21]
// Pourquoi ? "1" < "10" < "2" < "21" en ordre lexicographique
// (le '1' de "10" est comparé avant le '0', puis "2" > "1")

// ✅ Tri numérique croissant — a-b est négatif quand a < b
[10, 1, 21, 2].sort((a, b) => a - b); // [1, 2, 10, 21]

// ✅ Tri numérique décroissant
[10, 1, 21, 2].sort((a, b) => b - a); // [21, 10, 2, 1]

// ✅ Tri de chaînes avec accents — localeCompare gère ça correctement
['Émile', 'Alice', 'Éric', 'Bob'].sort((a, b) => a.localeCompare(b, 'fr'));
// ['Alice', 'Bob', 'Émile', 'Éric']
// Sans localeCompare, 'É' aurait un code Unicode > 'z', donc serait trié après !

// Tri d'objets par propriété
const employés = [
  { nom: 'Charlie', salaire: 3500 },
  { nom: 'Alice',   salaire: 4200 },
  { nom: 'Bob',     salaire: 3800 },
];
employés.sort((a, b) => a.salaire - b.salaire);
// [Charlie 3500, Bob 3800, Alice 4200]

// ⚠️ sort() MODIFIE le tableau original — contrairement à map/filter/reduce !
const arr = [3, 1, 2];
arr.sort((a, b) => a - b);
// arr est maintenant [1, 2, 3] — l'original est perdu !

// ✅ Pour ne pas muter l'original : copier d'abord
const trié = [...arr].sort((a, b) => a - b);

// Ou utiliser toSorted() (ES2023) — non-mutant par conception
const trié2 = arr.toSorted((a, b) => a - b);`}</CodeBlock>
      <InfoBox type="danger">
        <code>sort()</code> est la seule méthode de cette famille qui <strong>modifie le tableau original</strong>.
        Toutes les autres (<code>map</code>, <code>filter</code>, <code>reduce</code>, <code>find</code>,
        <code>flat</code>...) retournent de nouvelles valeurs sans toucher à la source. Quand tu utilises
        <code>sort()</code>, fais toujours une copie préalable avec <code>[...arr]</code> ou
        <code>arr.slice()</code> si tu veux préserver l'ordre original.
      </InfoBox>

      <h2>Chaînage de méthodes — pipelines de données</h2>
      <p>
        Puisque <code>map()</code>, <code>filter()</code>, <code>sort()</code> et leurs cousines retournent
        toutes de nouveaux tableaux, on peut les <strong>enchaîner</strong> directement : le résultat de l'une
        devient l'entrée de la suivante, formant un <em>pipeline de traitement</em>.
      </p>
      <p>
        C'est l'une des techniques les plus expressives de JavaScript. Un pipeline bien écrit se lit
        presque comme une phrase : "prends les commandes, garde celles qui sont payées, trie-les par montant
        décroissant, et formate-les en texte". Chaque méthode dans la chaîne représente une étape de traitement.
      </p>
      <CodeBlock language="javascript">{`const commandes = [
  { client: 'Alice', montant: 120, payé: true  },
  { client: 'Bob',   montant: 45,  payé: false },
  { client: 'Carol', montant: 200, payé: true  },
  { client: 'Dave',  montant: 80,  payé: false },
];

// Pipeline : commandes payées, triées, formatées
const résumé = commandes
  .filter(c => c.payé)                          // [Alice 120, Carol 200]
  .sort((a, b) => b.montant - a.montant)         // [Carol 200, Alice 120]
  .map(c => \`\${c.client}: \${c.montant}€\`);       // ['Carol: 200€', 'Alice: 120€']

console.log(résumé); // ['Carol: 200€', 'Alice: 120€']

// Calcul du total des impayés en une chaîne
const totalImpayé = commandes
  .filter(c => !c.payé)                          // [Bob 45, Dave 80]
  .reduce((sum, c) => sum + c.montant, 0);        // 125

// Pipeline complet : statistiques
const stats = commandes.reduce((acc, c) => ({
  total: acc.total + c.montant,
  payé: acc.payé + (c.payé ? c.montant : 0),
  impayé: acc.impayé + (!c.payé ? c.montant : 0),
}), { total: 0, payé: 0, impayé: 0 });
// { total: 445, payé: 320, impayé: 125 }`}</CodeBlock>
      <InfoBox type="tip">
        Le chaînage est lisible, mais chaque méthode crée un tableau intermédiaire. Sur des tableaux de
        millions d'éléments, <code>.filter().map()</code> crée deux tableaux. Pour les performances critiques,
        un seul <code>reduce()</code> peut tout faire en une passe. En pratique, pour des données de taille
        raisonnable ({'<'} 100 000 éléments), le chaînage est largement préférable pour sa lisibilité.
      </InfoBox>

      <Challenge title="Défi personnel à réaliser : Pipeline de données">
        Tu as un tableau de produits. Écris un pipeline qui retourne le nom des 3
        produits les plus chers avec un stock {'>'} 0, triés du plus cher au moins cher.
        <CodeBlock language="javascript">{`const produits = [
  { nom: 'A', prix: 50,  stock: 3 },
  { nom: 'B', prix: 120, stock: 0 },
  { nom: 'C', prix: 80,  stock: 5 },
  { nom: 'D', prix: 200, stock: 1 },
  { nom: 'E', prix: 30,  stock: 0 },
  { nom: 'F', prix: 150, stock: 2 },
];

// Attendu : ['D', 'F', 'C']
const résultat = produits
  .filter(p => p.stock > 0)              // A, C, D, F en stock
  .sort((a, b) => b.prix - a.prix)       // D(200), F(150), C(80), A(50)
  .slice(0, 3)                           // D(200), F(150), C(80)
  .map(p => p.nom);                      // ['D', 'F', 'C']`}</CodeBlock>
      </Challenge>
    </>
  );
}

export const chapter: Chapter = {
  id: 7,
  title: 'Méthodes de tableaux',
  icon: '🧰',
  level: 'Intermédiaire',
  stars: '★★★☆☆',
  component: Ch21,
  quiz: [
    {
      question: 'Que retourne [1, 2, 3].map(x => x * 2) ?',
      sub: 'map() transforme chaque élément en appliquant une fonction.',
      options: ['[1, 2, 3]', '[2, 4, 6]', '6', '[2, 4, 6, 8]'],
      correct: 1,
      explanation: '✅ Exact ! map() applique la fonction (x * 2) à chaque élément et retourne un NOUVEAU tableau de même longueur : [2, 4, 6]. Le tableau original [1, 2, 3] reste intact — map() ne mute jamais.',
    },
    {
      question: 'Quel est le résultat de [10, 1, 2].sort() ?',
      sub: 'Attention au comportement par défaut de sort() — il est surprenant !',
      options: ['[1, 2, 10]', '[10, 2, 1]', '[1, 10, 2]', '[10, 1, 2]'],
      correct: 2,
      explanation: '💡 Sans fonction de comparaison, sort() convertit chaque élément en chaîne et trie selon les points de code Unicode (ordre lexicographique). "1" < "10" < "2" car on compare caractère par caractère : "1" = "1", puis "0" < fin de chaîne. Pour un tri numérique correct : .sort((a, b) => a - b).',
    },
    {
      question: 'Quelle méthode s\'arrête dès le premier élément trouvé ?',
      sub: 'Court-circuit (short-circuit) : économiser du travail inutile.',
      options: ['filter()', 'map()', 'find()', 'reduce()'],
      correct: 2,
      explanation: '✅ Exact ! find() retourne le PREMIER élément qui satisfait la condition et arrête immédiatement le parcours. filter() lui, parcourt TOUJOURS tout le tableau pour collecter tous les résultats. Sur un tableau de 1 million d\'éléments, find() peut s\'arrêter au premier élément — filter() parcourt toujours tout.',
    },
    {
      question: 'Que se passe-t-il si on appelle reduce() sans valeur initiale sur un tableau vide ?',
      sub: 'La robustesse de reduce() dépend de sa valeur initiale.',
      options: ['Il retourne 0', 'Il retourne undefined', 'Il lève une TypeError', 'Il retourne []'],
      correct: 2,
      explanation: '💡 Sans valeur initiale, reduce() utilise le premier élément comme accumulateur initial. Sur un tableau vide, il n\'y a pas de premier élément → TypeError: Reduce of empty array with no initial value. Toujours fournir la valeur initiale : reduce((acc, x) => ..., 0) ou reduce((acc, x) => ..., []) ou reduce((acc, x) => ..., {}).',
    },
    {
      question: 'Que retourne [[1, 2], [3, [4, 5]]].flat() ?',
      sub: 'flat() avec la profondeur par défaut de 1.',
      options: ['[1, 2, 3, 4, 5]', '[1, 2, 3, [4, 5]]', '[[1, 2], [3, [4, 5]]]', '[1, [2], 3, [4, 5]]'],
      correct: 1,
      explanation: '✅ Exact ! flat() sans argument utilise une profondeur de 1 : il aplatit uniquement le premier niveau d\'imbrication. [1, 2] et [3, [4, 5]] sont aplatis, mais le tableau interne [4, 5] n\'est pas touché car il se trouve au deuxième niveau. Pour tout aplatir : flat(Infinity) ou flat(2).',
    },
    {
      question: 'Quelle est la différence entre findIndex() et indexOf() ?',
      sub: 'Deux façons de chercher un index dans un tableau.',
      options: [
        'findIndex() retourne -1, indexOf() retourne undefined',
        'indexOf() accepte une fonction prédicat, findIndex() non',
        'findIndex() accepte une fonction prédicat, indexOf() cherche une valeur exacte',
        'Il n\'y a aucune différence',
      ],
      correct: 2,
      explanation: '✅ Exact ! findIndex(fn) prend un prédicat et retourne l\'index du premier élément qui satisfait la condition — idéal pour les tableaux d\'objets : findIndex(u => u.id === 5). indexOf(valeur) cherche une valeur primitive par égalité stricte (===) — pratique pour les tableaux de nombres ou chaînes. Sur un tableau d\'objets, indexOf({ id: 5 }) retourne toujours -1 (égalité de référence).',
    },
    {
      question: 'Que retourne [1, 2, 3].at(-1) ?',
      sub: 'La méthode at() supporte les indices négatifs.',
      options: ['undefined', '1', '3', '-1'],
      correct: 2,
      explanation: '✅ Exact ! at(-1) retourne le dernier élément du tableau en comptant depuis la fin. -1 = dernier, -2 = avant-dernier, etc. C\'est équivalent à arr[arr.length - 1] mais bien plus lisible. at() est disponible sur les tableaux, chaînes et TypedArrays depuis ES2022.',
    },
    {
      question: 'Parmi ces méthodes, laquelle modifie le tableau original (mutation) ?',
      sub: 'Certaines méthodes sont mutantes, d\'autres non.',
      options: ['map()', 'filter()', 'fill()', 'flat()'],
      correct: 2,
      explanation: '💡 fill() modifie le tableau original en place : [1, 2, 3].fill(0) transforme le tableau en [0, 0, 0] sans créer de copie. map(), filter() et flat() retournent tous de nouveaux tableaux sans toucher à la source. Attention : sort() est aussi mutant ! Pour éviter la mutation avec fill, copie d\'abord : [...arr].fill(0).',
    },
    {
      question: 'Quel est l\'avantage de every() sur filter().length === 0 pour vérifier qu\'aucun élément ne satisfait une condition ?',
      sub: 'Court-circuit (short-circuit) et lisibilité.',
      options: [
        'every() est plus lisible mais identique en performance',
        'every() s\'arrête dès le premier élément qui échoue, filter() parcourt tout',
        'filter() est plus rapide car il utilise une boucle native',
        'Il n\'y a aucun avantage, les deux sont équivalents',
      ],
      correct: 1,
      explanation: '✅ Exact ! every() utilise le court-circuit : dès qu\'un élément ne satisfait pas la condition, il retourne false immédiatement sans parcourir le reste du tableau. filter() parcourt toujours tous les éléments pour collecter les correspondances. Sur un tableau de 1 million d\'éléments, every() peut s\'arrêter au premier élément — filter() fait toujours 1 million d\'itérations.',
    },
  ],
};
