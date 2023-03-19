async function getArticless() {
    const ecommerce = await fetch(
        "https://ecommercebackend.fundamentos-29.repl.co/"
    );
    const ans = await ecommerce.json();
    localStorage.setItem("articles", JSON.stringify(ans));
    return ans;
}

function CartWhenOpenOrResetBrowser(db) {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        db.cart = JSON.parse(storedCart);
        cartUpdateHTML(db);
    }
}

function printArticles(db) {
    let articlesHTML = document.querySelector(".articles");
    let html = "";

    db.articles.forEach(({ category, description, id, image, name, price, quantity }) => {
        const buttonClass = quantity === 0 ? "bx-plus-off" : "bx-plus";    //borrar si no sirve
        html += `
        <div class="article">
        <div class="article__img">
            <img src="${image}" alt="${name}">
        </div>
        <div class="article__body">
            <h3>${name} | <span>Stock: ${quantity}</span></h3>
            <p>${price}.00 USD <i class='bx ${buttonClass}' id="${id}"></i></p>
        </div>
    </div>`;
    });
    articlesHTML.innerHTML = html;
}

function handleShowCart() {
    let iconWishlistHTML = document.querySelector(".bx-cart");
    let cartHTML = document.querySelector(".cart");

    iconWishlistHTML.addEventListener("click", function () {
        cartHTML.classList.toggle("cart_show")
    });
}

function printHome() {
    let home_headerHTML = document.querySelector(".home_body");
    let html = "";
    html += `
            <h2 class="home_body-tit"> New Sweatshirt COLLECTIONS 2023 </h2>
            <p class="home_body-par"> Latest arrival of the new Hanes Midweight Crewneck sweatshirt imported
                    from the 2023 series, with a modern design. </p>
            <p class="home_body-pri"> $14.00 </p>
            <a href="#articles" class="home_body-btn">Show more</a>
    `;
    home_headerHTML.innerHTML = html;
}

function addToCart(db, articleFind) {
    if (db.cart[articleFind.id]) {
        if (articleFind.quantity === db.cart[articleFind.id].amount)
            return alert("NO DISPONIBLE, ESPERE A NUEVO STOCK")
        db.cart[articleFind.id].amount++;
    } else {
        let articleV2 = JSON.parse(JSON.stringify(articleFind));
        articleV2.amount = 1;
        db.cart[articleFind.id] = articleV2;
    }

    //IMPORTANTE PARA EL WISHLIST
    localStorage.setItem("cart", JSON.stringify(db.cart));
}

function cartUpdateHTML(db) {
    let cartArticlesHTML = document.querySelector(".cart_articles");
    let html = "";

    for (const key in db.cart) {
        const { amount, category, description, id, image, name, price, quantity } = db.cart[key];
        html += `
        <div class="cart_articles__item">
            <div class="cart_articles__img">
                <img src="${image}" alt="${name}">
            </div>
            <div class="cart_articles__body">
                <h3>${name} | <span>Stock: ${quantity}</span></h3>
                <p>${price}.00 USD </p>
            </div>
            <div class="cart_articles__box">
                <i class='bx bx-plus-circle' id="${id}" ></i> 
                <i class='bx bx-minus-circle' id="${id}" ></i> <span>${amount}</span>
                <i class='bx bx-trash' id="${id}" ></i> 
            </div>
        </div>`;
    }
    cartArticlesHTML.innerHTML = html;      

    cartTotalUpdateHTML(db); //Esto a lo mejor lo muevo
}

function cartTotalUpdateHTML(db) {
    let cartTotalArticlesHTML = document.querySelector(".cart_total");
    let totalCost = 0;
    let totalArticulos = 0;

    for (const key in db.cart) {
        const { amount, category, description, id, image, name, price, quantity } = db.cart[key];
        let ArticleCost = amount * price;
        totalCost = totalCost + ArticleCost;
        totalArticulos = totalArticulos + amount;
    }

    let html = `
        <h3>Total Cost: ${totalCost}.00 USD</h3>
        <h4>${totalArticulos} articulos</h4>
        <button class="cart_total_buy">Buy</button>
    `;

    cartTotalArticlesHTML.innerHTML = html;
}

function printArticlesCart(db) {
    let articlesHTML = document.querySelector(".articles");

    articlesHTML.addEventListener("click", (event) => {
        if (event.target.classList.contains("bx-plus")) {
            let articleID = Number(event.target.id);

            let articleFind = db.articles.find(function (article) {
                return article.id === articleID;
            });

            addToCart(db, articleFind);
            cartUpdateHTML(db);
        }
    });
}

// handleCartActions(db) {

// }

// function comprarConfirmacion(db) {

// }


async function main() {
    const storedArticles = localStorage.getItem("articles");

    const db = {
        articles: storedArticles ? JSON.parse(storedArticles) : await getArticless(),
        cart: {}
    };

    CartWhenOpenOrResetBrowser(db);
    printArticles(db);
    printHome();
    printArticlesCart(db);
    handleShowCart();

    let cartHTML = document.querySelector(".cart");

    cartHTML.addEventListener("click", function (event) {
        let articleID = Number(event.target.id);
        let articleFind = db.articles.find(function (article) {
            return article.id === articleID;
        });

        if (event.target.classList.contains("bx-plus-circle")) {
            if (db.cart[articleID].amount < articleFind.quantity) {
                db.cart[articleID].amount++;
                localStorage.setItem("cart", JSON.stringify(db.cart));
                cartUpdateHTML(db);
            } else {
                return alert("NO DISPONIBLE, ESPERE A NUEVO STOCK");
            }
        } else if (event.target.classList.contains("bx-minus-circle")) {
            db.cart[articleID].amount--;
            if (db.cart[articleID].amount === 0) {
                delete db.cart[articleID];
            }
            localStorage.setItem("cart", JSON.stringify(db.cart));
            cartUpdateHTML(db);
        } else if (event.target.classList.contains("bx-trash")) {
            delete db.cart[articleID];
            localStorage.setItem("cart", JSON.stringify(db.cart));
            cartUpdateHTML(db);
        }
        // console.log(db)
        // console.log("articles[#].quantity: ", articleFind.quantity);         //Apenas asi encontre el error...
        // console.log("cart[#].amount: ", db.cart[articleID]?.amount || 0);    //
    });


    document.querySelector(".cart_total").addEventListener("click", function (event) {
        if (event.target.classList.contains("cart_total_buy")) {
            const decisionDeComprar = confirm("Confirmacion de proceder al pago");

            if (decisionDeComprar) {
                for (const key in db.cart) {
                    const articleID = Number(key);
                    const articleFindIndex = db.articles.findIndex(article => article.id === articleID);
        
                    if (articleFindIndex !== -1) {
                        const newQuantity = db.articles[articleFindIndex].quantity - db.cart[articleID].amount;
        
                        if (newQuantity >= 0) { 
                            db.articles[articleFindIndex].quantity = newQuantity;
                        } else {
                            alert("ERROR: Sentimos las molestias, en realidad no hay stock."); //Parchesito en caso de un error (que ya no veo que salga)
                            return;
                        }
                    }
                }
                db.cart = {};
                localStorage.setItem("cart", JSON.stringify(db.cart));
                localStorage.setItem("articles", JSON.stringify(db.articles));
                printArticles(db);
                printArticlesCart(db);
                cartUpdateHTML(db);
            }
        
        }
    });
    
    //Le podria limpiar aun mas el Index al separarlo en funciones, pero ya sirve!
    //Este lo mandare porque parece ya no tener errores
    //Para no retrasarme mas, hasta aqui lo dejare. Posiblemente lo updatee mas tarde para separarlo.

}

main();
