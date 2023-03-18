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
        html += `
        <div class="article">
        <div class="article__img">
            <img src="${image}" alt="${name}">
        </div>
        <div class="article__body">
            <h3>${name} | <span>Stock: ${quantity}</span></h3>
            <p>${price}.00 USD <i class='bx bx-plus' id="${id}"></i></p>
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
        if (articleFind.quantity === db.cart[articleFind.id].amount) return alert("NO DISPONIBLE")
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
    let cartArticlesHTML = document.querySelector(".cart");
    let html = "";

    for (const key in db.cart) {
        const { amount, category, description, id, image, name, price, quantity } = db.cart[key];
        html += `
        <div class="cart_articles">
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

        if (event.target.classList.contains("bx-plus-circle")) {
            db.cart[articleID].amount++;
            localStorage.setItem("cart", JSON.stringify(db.cart));
            let articleFind = db.articles.find(function (article) {
                return article.id === articleID;
            });

            cartUpdateHTML(db);
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
    });
}

main();
