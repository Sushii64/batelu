<script>
    let messages = [
        "How did we get here?",
        "I don't know about that one, mate.",
        "What?",
        "Just smile and nod...",
        "Try something else.",
        "???"
    ]

    let message = messages[Math.floor(Math.random() * messages.length)]
</script>

<main class="container">
	<h1>Whoops!</h1>
	<p>Error 404 - Page not found!</p>
	<blockquote>{message}</blockquote>
</main>