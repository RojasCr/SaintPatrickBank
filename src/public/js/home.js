const cotizaciones = document.getElementById("cotizaciones");


const url = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";

fetch(url)
.then(response =>response.json())
.then(data => {
    const dolar = [];
    data.forEach(d => {
        if(d.casa.nombre == "Dolar Oficial")
        dolar.push(d);
    })
    


    dolar.forEach( d => {
        
        let div = document.createElement("div");
        cotizaciones.appendChild(div);
        div.innerHTML = `<table border="1">
                            <caption>${d.casa.nombre}</caption>
                            <tr>
                                <td>Compra: ${d.casa.compra}</td>
                                <td>Venta: ${d.casa.venta}</td>
                            </tr>
                        </table>`
        
        
        // `<span>${d.casa.nombre}</span>
        //                 <span>${d.casa.compra}   ${d.casa.venta}</span>`
        
    })
    //cotizaciones.innerHTML=dolar[0].casa.compra
        
    console.log(data);
})
.catch(err => console.log(err))
