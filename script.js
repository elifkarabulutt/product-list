
let productList;

// "fetch" kullanarak JSON dosyasını çekiyoruz.
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    productList = data;
    // Verileri aldıktan sonra, alışveriş sayfasını oluşturan işlevi çağırıyoruz.
    createShoppingPage();
  })
  .catch((error) => console.log("Bir hata oluştu: ", error));


function createShoppingPage() {
 
  const productListContainer = document.getElementById("productListContainer");
  const searchInput = document.getElementById("searchInput");
  const categoryTags = document.querySelectorAll(".categoryTag");
  const cartIcon = document.getElementById("cartIcon");
  const cartDialog = document.getElementById("cartDialog");
  
  let shoppingCart = [];
  displayProducts(productList);
  searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredProducts = productList.filter((product) =>
      product.title.toLowerCase().includes(searchText)
    );
    displayProducts(filteredProducts);
  });
   categoryTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const category = tag.dataset.category;
      if (category === "all") {
        displayProducts(productList);
      } else {
        const filteredProducts = productList.filter(
          (product) => product.category === category
        );
        displayProducts(filteredProducts);
      }
    });
  });
  function displayProducts(products) {
    productListContainer.innerHTML = "";
    products.forEach((product) => {
      const productCard = createProductCard(product);
      productListContainer.appendChild(productCard);
    });
  }

  function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("productCard");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.title;
    productCard.appendChild(productImage);

    const productTitle = document.createElement("h2");
    productTitle.textContent = product.title;
    productCard.appendChild(productTitle);

    const productPrice = document.createElement("p");
    productPrice.textContent = `${product.price} TL`;
    productCard.appendChild(productPrice);

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Sepete Ekle";
    addToCartButton.addEventListener("click", () => addToCart(product));
    productCard.appendChild(addToCartButton);

    return productCard;
  }

  function addToCart(product) {
    shoppingCart.push(product);
    updateCartIcon();

    const alertDiv = document.createElement("div");
    alertDiv.textContent = `${product.title} sepete eklendi.`;
    alertDiv.classList.add("alert");
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "50%";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(alertDiv);
  
    setTimeout(() => {
      document.body.removeChild(alertDiv);
    }, 2000);
  }

  function updateCartIcon() {
    const cartItemCount = shoppingCart.length;
    const cartCountElement = document.getElementById("cartCount");
    cartCountElement.textContent = cartItemCount;
  }

  cartIcon.addEventListener("click", () => {
    displayCartDialog();
    
  });


  function displayCartDialog() {
    cartDialog.innerHTML = "";
    if (shoppingCart.length === 0) {
      const emptyCartMessage = document.createElement("p");
      emptyCartMessage.textContent = "Sepetinizde ürün yok.";
      cartDialog.appendChild(emptyCartMessage);
    } else {
      let totalAmount = 0; 
      shoppingCart.forEach((product) => {
        const productCartItem = createCartItem(product);
        cartDialog.appendChild(productCartItem);
        totalAmount += product.price;
      });  
       const totalAmountElement = document.createElement("p");
      totalAmountElement.textContent = `Toplam Tutar: ${totalAmount} TL`;
      cartDialog.appendChild(totalAmountElement);
    }
     const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", () => {
      cartDialog.style.display = "none";
    });
    cartDialog.appendChild(closeButton);
    cartDialog.style.display = "block";
  }

function createCartItem(product) {
  const productCartItem = document.createElement("div");
  productCartItem.classList.add("productCartItem");


  const productImage = document.createElement("img");
  productImage.src = product.image;
  productImage.alt = product.title;
  productCartItem.appendChild(productImage);

  const productTitle = document.createElement("h3");
  productTitle.textContent = product.title;
  productCartItem.appendChild(productTitle);

  const productPrice = document.createElement("p");
  productPrice.textContent = `${product.price} TL`;
  productCartItem.appendChild(productPrice);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Sil";
  deleteButton.addEventListener("click", () => removeItemFromCart(product));
  productCartItem.appendChild(deleteButton);

  return productCartItem;
}


  function removeItemFromCart(product) {
    const index = shoppingCart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      shoppingCart.splice(index, 1);
      updateCartIcon();
      displayCartDialog();
    }
  }
 
}
