<main>
    <h1>FluentSpot</h1>
    <slot>
        <p>Loading...</p>
    </slot>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 50px;
    }

    h1 {
        font-size: 3rem;
    }
</style>
