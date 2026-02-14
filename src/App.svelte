<script>
    import { onMount } from 'svelte';

    import Home from './pages/Home.svelte';
    import NotFound from './pages/errors/404.svelte'
    import Reference from './pages/Reference.svelte';
    import Words from './pages/Words.svelte';
    import About from './pages/About.svelte';
    import Phonology from './pages/Phonology.svelte';

    let Component = NotFound;

    function route(pathname = location.pathname) {
        switch (pathname.replace(/\/$/, '')) {
            case '/':
            case '':
                Component = Home;
                break;

            case '/ref':
                Component = Reference;
                break;

            case '/words':
                Component = Words;
                break;

            case '/about':
                Component = About;
                break;

			case '/phono':
                Component = Phonology;
                break;

            default:
                Component = NotFound;
                break;
        }
    }

    function navigate(path) {
        if (location.pathname !== path) {
            history.pushState({}, '', path);
            route(path);
        }
    }

    onMount(() => {
        route();
        const onPopState = () => route();
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    });
</script>

<nav class="nav">
	<a href="/" on:click|preventDefault={() => navigate('/')}>Home</a>
	<a href="/ref" on:click|preventDefault={() => navigate('/ref')}>Reference</a>
	<a href="/words" on:click|preventDefault={() => navigate('/words')}>Words</a>
	<a href="/about" on:click|preventDefault={() => navigate('/about')}>About</a>
	<a href="/phono" on:click|preventDefault={() => navigate('/phono')}>Phonology</a>
</nav>

<svelte:component this={Component} />
