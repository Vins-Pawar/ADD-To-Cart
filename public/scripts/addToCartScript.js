function addToCart(productId) {
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: productId })
    })
        .then(response => {
            if (response.ok) {
                alert('Product added to cart!');
                // showCart();
            } else {
                alert('Failed to add product to cart!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add product to cart!');
        });
    //ajax call to the showCart function so cart update without refereshing the page
    setTimeout(() => {
        showCart();
    }, 100);
    
}

function showCart() {
    $.ajax({
        url: '/cart', 
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#cartItems').empty();
            if (data.length === 0) {
                $('#cartItems').attr('id','emptyCart').append('<p>Cart is empty</p>');
            } else {
                var table = $('<table>').append(
                    $('<tr>').append(
                        $('<th>').text('Product ID'),
                        $('<th>').text('Product Name'),
                        $('<th>').text('Product Price'),
                        $('<th>').text('Product Image'),
                        $('<th>').text('Quantity'),
                        $('<th>').text('Action')
                    )
                );
                data.forEach(function (item) {
                    var row = $('<tr>').append(
                        $('<td>').text(item.product_id).addClass('productId').attr('value', item.product_id),
                        $('<td>').text(item.product_name).addClass('productName').attr('value', item.product_name),
                        $('<td>').text(item.product_price).addClass('productPrice').attr('value', item.product_price),
                        $('<td>').append($('<img>').attr('src',  '/images/'+item.product_image).attr('alt', item.product_name)),
                        $('<td>').append($('<input>').addClass('quantity-input').attr('type', 'number').attr('value', 1).attr('min', 1)),
                        $('<td>').append($('<button>').addClass('delete-button').text('Delete').click(function () {
                            deleteProduct(item.product_id);
                        }))
                    );
                    table.append(row);
                });

                $('#cartItems').append(table);
            }
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch cart data:', error);
            alert('Failed to fetch cart data: ' + error);
        }
    });
}

function handleCheckout() {
    fetch('/checkOut', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }) 
}

function deleteProduct(productId) {
    fetch('deleteFromCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: productId })
    })
        .then(response => {
            if (response.ok) {
                alert("Item Is deleted from Cart")
            }
            else {
                alert("Error in deleting item from cart");
            }
        })
        .catch(err => {
            console.log(err);
        });
    //update cart without refreshing
    setTimeout(() => {
        showCart();
    }, 100);
    // showCart();
}

function totalProducts() {
    const productIdElements = document.getElementsByClassName('productId');
    let totalProducts = 0;
    let totalPrice = 0;

    // Loop through each product row
    console.log(productIdElements.length);
    for (let i = 0; i < productIdElements.length; i++) {
        const productId = productIdElements[i].textContent; // Get the product ID from the row
        const productPrice = parseFloat(document.getElementsByClassName('productPrice')[i].textContent); // Get the product price from the row
        totalProducts++; // Increment total products count
        totalPrice += productPrice; // Add product price to total price
    }

    console.log('Total Products:', totalProducts);
    console.log('Total Price:', totalPrice);
}
function toggleCart() {
    const cartSection = document.getElementById('cartItemElements');
    cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
    
    // console.log(productId);
    if (cartSection.style.display === 'block') {
        
            showCart(); 
            totalProducts();
         
        // addEventListener("load", totalProducts);
    }
}