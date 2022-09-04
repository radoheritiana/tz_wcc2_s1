
const Token = () => {
    
    window.onload = () => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let value = params.code;
        getToken(value);
    }

    const getToken = async (value) => {
        const requete = await fetch(
            'http://localhost:5000/token?code='+value
        )
        const response = await requete.json();
        window.sessionStorage.setItem('token', response.token);
        window.location.href = "/search";
    }
}

export default Token;