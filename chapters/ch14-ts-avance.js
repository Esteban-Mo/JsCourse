export default {
    id: 17,
    title: 'TypeScript — Avancé',
    icon: '💎',
    level: 'Bonus TypeScript',
    stars: '★★★★★',
    content: () => `
      <div class="ts-badge">🔷 BONUS · TypeScript Avancé</div>
      <div class="chapter-tag">Chapitre 17 · TypeScript Expert</div>
      <h1>TypeScript<br><span class="highlight" style="color:#3178c6">Niveau Expert</span></h1>
      <div class="chapter-intro-card" style="border-color:rgba(49,120,198,0.3);background:linear-gradient(135deg,var(--surface),rgba(49,120,198,0.08))">
        <div class="level-badge level-typescript">💎</div>
        <div class="chapter-meta">
          <div class="difficulty-stars" style="color:#3178c6">★★★★★</div>
          <h3>Utility Types, Mapped Types, Conditional Types, infer</h3>
          <p>Durée estimée : 50 min · 2 quizz inclus</p>
        </div>
      </div>

      <h2>Utility Types intégrés</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="kw">interface</span> <span class="cls">User</span> {
  id<span class="op">:</span> <span class="cls">number</span>;
  nom<span class="op">:</span> <span class="cls">string</span>;
  email<span class="op">:</span> <span class="cls">string</span>;
  role<span class="op">:</span> <span class="str">"admin"</span> <span class="op">|</span> <span class="str">"user"</span>;
}

<span class="cmt">// Partial : toutes les propriétés optionnelles</span>
<span class="kw">type</span> <span class="cls">UserUpdate</span> <span class="op">=</span> <span class="cls">Partial</span><span class="op">&lt;</span><span class="cls">User</span><span class="op">&gt;</span>;
<span class="cmt">// { id?: number; nom?: string; ... }</span>

<span class="cmt">// Required : toutes les propriétés obligatoires</span>
<span class="kw">type</span> <span class="cls">UserFull</span> <span class="op">=</span> <span class="cls">Required</span><span class="op">&lt;</span><span class="cls">User</span><span class="op">&gt;</span>;

<span class="cmt">// Pick : garder certaines propriétés</span>
<span class="kw">type</span> <span class="cls">UserPublic</span> <span class="op">=</span> <span class="cls">Pick</span><span class="op">&lt;</span><span class="cls">User</span>, <span class="str">"nom"</span> <span class="op">|</span> <span class="str">"role"</span><span class="op">&gt;</span>;

<span class="cmt">// Omit : exclure certaines propriétés</span>
<span class="kw">type</span> <span class="cls">UserWithoutId</span> <span class="op">=</span> <span class="cls">Omit</span><span class="op">&lt;</span><span class="cls">User</span>, <span class="str">"id"</span><span class="op">&gt;</span>;

<span class="cmt">// Record : objet avec clés et valeurs typées</span>
<span class="kw">type</span> <span class="cls">RoleMap</span> <span class="op">=</span> <span class="cls">Record</span><span class="op">&lt;</span><span class="cls">User</span>[<span class="str">"role"</span>], <span class="cls">string</span>[]<span class="op">&gt;</span>;
<span class="kw">const</span> roles<span class="op">:</span> <span class="cls">RoleMap</span> <span class="op">=</span> { admin: [<span class="str">"Alice"</span>], user: [<span class="str">"Bob"</span>] };

<span class="cmt">// ReturnType & Parameters</span>
<span class="kw">function</span> <span class="fn">fetchUser</span>(id<span class="op">:</span> <span class="cls">number</span>)<span class="op">:</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="cls">User</span><span class="op">&gt;</span> { <span class="kw">return</span> <span class="cls">Promise</span>.<span class="fn">resolve</span>({} <span class="kw">as</span> <span class="cls">User</span>); }
<span class="kw">type</span> <span class="cls">FetchReturn</span>  <span class="op">=</span> <span class="cls">ReturnType</span><span class="op">&lt;</span><span class="kw">typeof</span> fetchUser<span class="op">&gt;</span>;   <span class="cmt">// Promise&lt;User&gt;</span>
<span class="kw">type</span> <span class="cls">FetchParams</span>  <span class="op">=</span> <span class="cls">Parameters</span><span class="op">&lt;</span><span class="kw">typeof</span> fetchUser<span class="op">&gt;</span>;  <span class="cmt">// [number]</span></pre>
      </div>

      <h2>Mapped Types</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="cmt">// Créer un type basé sur un autre</span>
<span class="kw">type</span> <span class="cls">Readonly</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> <span class="op">=</span> {
  <span class="kw">readonly</span> [<span class="cls">K</span> <span class="kw">in</span> <span class="kw">keyof</span> <span class="cls">T</span>]<span class="op">:</span> <span class="cls">T</span>[<span class="cls">K</span>];
};

<span class="cmt">// Type qui rend nullable toutes les propriétés</span>
<span class="kw">type</span> <span class="cls">Nullable</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> <span class="op">=</span> {
  [<span class="cls">K</span> <span class="kw">in</span> <span class="kw">keyof</span> <span class="cls">T</span>]<span class="op">:</span> <span class="cls">T</span>[<span class="cls">K</span>] <span class="op">|</span> <span class="kw">null</span>;
};

<span class="cmt">// Filtrer les propriétés d'un type</span>
<span class="kw">type</span> <span class="cls">OnlyStrings</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> <span class="op">=</span> {
  [<span class="cls">K</span> <span class="kw">in</span> <span class="kw">keyof</span> <span class="cls">T</span> <span class="kw">as</span> <span class="cls">T</span>[<span class="cls">K</span>] <span class="kw">extends</span> <span class="cls">string</span> ? <span class="cls">K</span> : <span class="kw">never</span>]<span class="op">:</span> <span class="cls">T</span>[<span class="cls">K</span>];
};</pre>
      </div>

      <h2>Conditional Types & infer</h2>
      <div class="code-block">
        <div class="code-header"><div class="code-dots"><span></span><span></span><span></span></div><div class="code-lang">typescript</div></div>
        <pre><span class="cmt">// Type conditionnel : T extends U ? X : Y</span>
<span class="kw">type</span> <span class="cls">IsString</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> <span class="op">=</span> <span class="cls">T</span> <span class="kw">extends</span> <span class="cls">string</span> ? <span class="kw">true</span> : <span class="kw">false</span>;
<span class="kw">type</span> <span class="cls">A</span> <span class="op">=</span> <span class="cls">IsString</span><span class="op">&lt;</span><span class="cls">string</span><span class="op">&gt;</span>; <span class="cmt">// true</span>
<span class="kw">type</span> <span class="cls">B</span> <span class="op">=</span> <span class="cls">IsString</span><span class="op">&lt;</span><span class="cls">number</span><span class="op">&gt;</span>; <span class="cmt">// false</span>

<span class="cmt">// infer : extraire un type à l'intérieur d'un autre</span>
<span class="kw">type</span> <span class="cls">UnwrapPromise</span><span class="op">&lt;</span><span class="cls">T</span><span class="op">&gt;</span> <span class="op">=</span>
  <span class="cls">T</span> <span class="kw">extends</span> <span class="cls">Promise</span><span class="op">&lt;</span><span class="kw">infer</span> <span class="cls">U</span><span class="op">&gt;</span> ? <span class="cls">U</span> : <span class="cls">T</span>;

<span class="kw">type</span> <span class="cls">X</span> <span class="op">=</span> <span class="cls">UnwrapPromise</span><span class="op">&lt;</span><span class="cls">Promise</span><span class="op">&lt;</span><span class="cls">string</span><span class="op">&gt;&gt;</span>; <span class="cmt">// string</span>
<span class="kw">type</span> <span class="cls">Y</span> <span class="op">=</span> <span class="cls">UnwrapPromise</span><span class="op">&lt;</span><span class="cls">number</span><span class="op">&gt;</span>;          <span class="cmt">// number</span>

<span class="cmt">// Template Literal Types (TS 4.1+)</span>
<span class="kw">type</span> <span class="cls">EventName</span><span class="op">&lt;</span><span class="cls">T</span> <span class="kw">extends</span> <span class="cls">string</span><span class="op">&gt;</span> <span class="op">=</span> <span class="str">\`on\${Capitalize&lt;T&gt;}\`</span>;
<span class="kw">type</span> <span class="cls">ClickEvent</span> <span class="op">=</span> <span class="cls">EventName</span><span class="op">&lt;</span><span class="str">"click"</span><span class="op">&gt;</span>;  <span class="cmt">// "onClick"</span>
<span class="kw">type</span> <span class="cls">Events</span> <span class="op">=</span> <span class="cls">EventName</span><span class="op">&lt;</span><span class="str">"click"</span> <span class="op">|</span> <span class="str">"focus"</span> <span class="op">|</span> <span class="str">"blur"</span><span class="op">&gt;</span>;
<span class="cmt">// "onClick" | "onFocus" | "onBlur"</span></pre>
      </div>

      <div class="info-box success">
        <div class="info-icon">💎</div>
        <p>Les types conditionnels et <code>infer</code> permettent de créer des types qui raisonnent sur d'autres types — c'est de la <strong>métaprogrammation de types</strong>. C'est ce que font des libs comme <code>zod</code>, <code>trpc</code>, et <code>prisma</code> en interne.</p>
      </div>
    `,
    quiz: [
      {
        question: "Que fait Omit<User, 'id'> en TypeScript ?",
        sub: "Utility Types TypeScript",
        options: [
          "Crée un type User sans la propriété 'id'",
          "Rend 'id' optionnel",
          "Supprime 'id' de l'objet à l'exécution",
          "Crée un nouveau type avec uniquement 'id'"
        ],
        correct: 0,
        explanation: "✅ Exact ! Omit<T, K> crée un nouveau type en excluant les propriétés listées dans K. Omit<User, 'id'> = { nom: string; email: string; role: ... } — sans id."
      },
      {
        question: "À quoi sert le mot-clé infer dans un type conditionnel ?",
        sub: "Types conditionnels avancés",
        options: [
          "À inférer le type d'une variable JS",
          "À extraire et capturer un type inconnu à l'intérieur d'un type conditionnel",
          "À forcer TypeScript à accepter any",
          "À créer un type récursif"
        ],
        correct: 1,
        explanation: "✅ Parfait ! infer permet de capturer un type 'caché' dans un type complexe. Dans T extends Promise<infer U>, U capture le type résolu de la Promise — même si on ne le connaît pas à l'avance."
      }
    ]
};
