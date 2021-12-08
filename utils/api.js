class API {
    API_URL = "https://weatherapp.app01.prd.tor.quazi.co/";

    async request(endpoint, parameters, method = "GET") {
        let request = {
            method,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        if (method === "GET") {
            request = {
                ...request,
            }
            endpoint += '?' + new URLSearchParams(parameters).toString();
        } else {
            request = {
                ...request,
                body: JSON.stringify(parameters)
            }
        }

        return fetch(`${this.API_URL}${endpoint}`, request);
    }

    get (city = ["Toronto"]) {
        return this.request("get", { cities: city }, "POST").then(resp => resp.json());
    }

}

export default API;