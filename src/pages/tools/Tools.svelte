<script>
  export let navigate;
</script>

<main class="container">
  <h1>Tools</h1>
  <p>There's not a lot of these yet.</p>
  <ul>
    <li>
      <a
        href="/tools/numbers"
        on:click|preventDefault={() => navigate("/tools/numbers")}>nimrapawi</a
      >: Convert decimal numbers to Batelu.
    </li>
  </ul>
</main>
