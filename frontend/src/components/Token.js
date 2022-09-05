
const Token = () => {
    const getToken = async (value) => {
        const requete = await fetch(
            'https://rhja.pythonanywhere.com/token?code='+value
        )
        const response = await requete.json();
        window.sessionStorage.setItem('token', response.token);
        window.location.href = "/search";
    }
    if (document.readyState === "complete") {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let value = params.code;
        getToken(value);
    } else {
        window.onload = () => {
            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });

            let value = params.code;
            getToken(value);
        }
    }


}

export default Token;