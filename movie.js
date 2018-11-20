var app = new Vue({
    el: '#app',
    data: {
        //temporary "database" to store different kinds of movies
        items: [
            {id: 0, name: 'Star Wars Episode IV DVD ($20)', blueray: false, price: 20 },
            {id: 1, name: 'Star Wars Episode V DVD ($20)', blueray: false, price: 20 },
            {id: 2, name: 'Star Wars Episode VI DVD ($20)', blueray: false, price: 20 },
            {id: 3, name: 'Star Wars Episode IV Blueray ($25)', blueray: true, price: 25 },
            {id: 4, name: 'Star Wars Episode V Blueray ($25)', blueray: true, price: 25 },
            {id: 5, name: 'Star Wars Episode VI Blueray ($25)', blueray: true, price: 25 }
        ],
        //initialization of empty cart
        cart: [
            
        ],
        //# of items in cart
        size: 0,
        //total cost of items before discounts are applied
        total: 0,
        // boolean to represent if user has activated the blue ray discount (all 3 blue-rays in cart)
        bluerayDiscount: false,
        // boolean to represent if user has activated the dvd discount (all 3 dvd's in cart)
        dvdDiscount: false,
        // boolean to represent if user has activated the bulk discount (100 or more items in cart)
        bulkDiscount: false,
        //running total of discounts collected by user
        totalDiscount: 0
    },
    methods: {
        /*
        Adds movie to cart based on index clicked by user 
        */
        addToCart: function(index) {
            var movie = app.items[index];
            //finds cart item matching movie
            var item = app.cart.find(obj => {
                return obj.item.id === movie.id
            });
            //adds movie to cart if not present already, else increases quantity
            if (jQuery.isEmptyObject(item)) {
                app.cart.push({item: movie, quantity: 1});
            } else {
                item.quantity += 1;
            } 
            app.size += 1; //increment size of cart
            app.total += movie.price; //add cost of movie to total
            
            //checking to see if the user is able to apply dvd discount
            if (app.size >= 3 && !app.dvdDiscount) {
                var filtered = app.cart.filter(function(value){
                    return value.item.blueray ==  false;
                });
                if (filtered.length == 3) {
                    app.totalDiscount += 6; 
                    app.dvdDiscount = true;
                }
            }
            //checking to see if user is able to apply blueray discount
            if (app.size >= 3 && !app.bluerayDiscount) {
                var filtered = app.cart.filter(function(value){
                    return value.item.blueray ==  true;
                });
                console.log(filtered);
                if (filtered.length == 3) {
                    app.totalDiscount += 11.25;
                    app.bluerayDiscount = true;
                }
            }
            //checking to see if user is able to apply bulk discount
            if (app.size >= 100 && !app.bulkDiscount) {
                app.bulkDiscount = true;
            }
        },
        /*
        Removes movie from cart entirely
        */
        removeFromCart: function(movie) {
            var filtered = app.cart.filter(function(value){
                return value.item.id !=  movie.item.id;
            });
            app.cart = filtered;
            app.size -= movie.quantity;
            app.total -= (movie.item.price * movie.quantity); 
            //checking to see if removing this item causes the user to lose the dvd discount
            if (app.dvdDiscount) {
                var filtered = app.cart.filter(function(value){
                    return value.item.blueray ==  false;
                });
                if (filtered.length <= 3) {
                    //app.total += 6;
                    app.totalDiscount -= 6;
                    app.dvdDiscount = false;
                }
            }
            //checking to see if removing this item causes the user to lose the blueray discount
            if (app.bluerayDiscount) {
                var filtered = app.cart.filter(function(value){
                    return value.item.blueray ==  true;
                });
                if (filtered.length <= 3) {
                    //app.total += 11.25;
                    app.totalDiscount -= 11.25;
                    app.bluerayDiscount = false;
                }
            }
            //checking to see if removing this item causes the user to lose the bulk discount
            if (app.size < 100 && app.bulkDiscount) {
                app.bulkDiscount = false;
            }
            
        },
        /*
        Increments movie quantity by 1
        */
        increment: function(movie) {
            movie.quantity += 1;
            app.size += 1;
            app.total += movie.item.price;
            //checking to see if increasing this item allows user to apply bulk discount
            if (app.size >= 100 && !app.bulkDiscount) {
                app.bulkDiscount = true;
            }
        },
        /*
        Decrements movie quantity by 1
        */
        decrement: function(movie) {
            if (movie.quantity === 1) {
                app.removeFromCart(movie);
            } else {
                movie.quantity -= 1;
                app.size -= 1;
                app.total -= movie.item.price;
            }
            //checking to see if removing this item causes the user to lose the bulk discount
            if (app.size < 100 && app.bulkDiscount) {
                app.bulkDiscount = false;
            }
        },
        //function for formatting decimal values
        round: function(amount) {
            return Math.round(amount * 100) / 100;
        }
        
    }
});

$(document).ready(function() {
    //cart popover content 
    $('#cart').popover({
        content: $('#popover-content')
    }).on('show.bs.popover', function() {
        $('#popover-content').removeClass('d-none')
    });
})