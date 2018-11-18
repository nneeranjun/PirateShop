var app = new Vue({
    el: '#app',
    data: {
        items: [
            {id: 0, name: 'Star Wars Episode IV DVD ($20)', blueray: false, price: 20 },
            {id: 1, name: 'Star Wars Episode V DVD ($20)', blueray: false, price: 20 },
            {id: 2, name: 'Star Wars Episode VI DVD ($20)', blueray: false, price: 20 },
            {id: 3, name: 'Star Wars Episode IV DVD ($25)', blueray: true, price: 25 },
            {id: 4, name: 'Star Wars Episode V DVD ($25)', blueray: true, price: 25 },
            {id: 5, name: 'Star Wars Episode VI DVD ($25)', blueray: true, price: 25 }
        ],
        cart: [
            
        ],
        size: 0,
        total: 0
    },
    methods: {
        addToCart: function(index) {
            var movie = app.items[index];
            var item = app.cart.find(obj => {
                return obj.item.id === movie.id
            });
            if (jQuery.isEmptyObject(item)) {
                app.cart.push({item: movie, quantity: 1});
            } else {
                item.quantity += 1;
                console.log(item.quantity);
            } 
            app.size += 1;
            app.total += movie.price;
        },
        
        removeFromCart: function(movie) {
            var filtered = app.cart.filter(function(value){
                return value.item.id !=  movie.item.id;
            });
            app.cart = filtered;
            app.size -= movie.quantity;
            app.total -= (movie.item.price * movie.quantity); 
        },
        
        increment: function(movie) {
            movie.quantity += 1;
            app.size += 1;
            app.total += movie.item.price;
        },
        
        decrement: function(movie) {
            if (movie.quantity === 1) {
                app.removeFromCart(movie);
            } else {
                movie.quantity -= 1;
                app.size -= 1;
                app.total -= movie.item.price;
            }
        }
        
    }
});

$(document).ready(function() {
    $('#cart').popover({
        content: $('#popover-content')
    }).on('show.bs.popover', function() {
        $('#popover-content').removeClass('d-none')
    });
})