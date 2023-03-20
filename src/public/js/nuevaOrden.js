

const form = document.getElementById("orderForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value
    });

    obj.date = new Date().toLocaleString();

    const url = "/auth/newOrder";
    const headers = {
        "Content-Type": "application/json"
    };
    const method = "POST";
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => {
        if(response.redirected){
           window.location.href = response.url
           return;
        }
        response.json()
    })
    .then(data => console.log(data))
    .catch(err => console.log(err))
})