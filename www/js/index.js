$(document).bind("deviceready", function() {
    var div_template = "";
    var search_val = "";
    var loading_screen_open = 1;
    var cart_loading_screen_open = 0;
    var back_page = "";
    var back_page_val = "";

    screen.orientation.lock('portrait-primary');
    StatusBar.backgroundColorByHexString("#16C4BB");
    userControl();
}); 

document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown(){
    if($("#search-panel").hasClass("ui-panel-open") == true){
        $( "#search-panel" ).panel( "close" );
    } else if($("#cart-panel").hasClass("ui-panel-open") == true){
        $( "#cart-panel" ).panel( "close" );
    } else if(back_page == "getCategories"){
        getCategories();
    } else if(back_page == "getProducts"){
        getProducts(back_page_val);
    } else if(back_page == "getProductSearch"){
        getProductSearch(back_page_val);
    } else{
        return;
    }
}

$(document).on("tap","#addCart",function(){
    navigator.vibrate(300);
});
    
$(document).on('tap','#searchButton',function(){
    if($('#search').val().length >= 3){
        $('#search').css("color","black");
        getProductSearch($('#search').val());
    } else{
        $('#search').css("color","red");
    }
});

$(document).on('keyup','.signUp',function(){
    if($('#user_name').val().length > 2 && $('#firm_name').val().length > 2 && ($('#phone_number').val().length == 10 || $('#phone_number').val().length == 11)){
        $('#signUp').css("background-color","#16C4BB");
        $('#signUp').attr("disabled", false);
    } else{
        $('#signUp').css("background-color","#AA0000");
        $('#signUp').attr("disabled", true);
    }
});

$(document).on( "pageinit", "#page1", function() {
    $(document).on( "swipeleft swiperight", "#page1", function( e ) {

        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" && loading_screen_open == 0){
                $( "#cart-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" && loading_screen_open == 0){
                $( "#search-panel" ).panel( "open" );
            }
        }
    });
});

$(document).on('tap','#unitPlus',function(){
    if($('#unit').val() > 0){
        $('#unit').val(parseInt($('#unit').val())+100);
    }
});

$(document).on('tap','#unitMinus',function(){
    if($('#unit').val() > 100){
        $('#unit').val(parseInt($('#unit').val())-100);
    }
});

function removeProductCart(cart_id, product_name){
    navigator.notification.confirm(
        'Are you sure you want to delete the "'+product_name+'" product?', 
        function(buttonIndex){
            deleteCartProduct(buttonIndex, cart_id);
        },
        'Delete Product!',
        ['Delete','Cancel']
    );
}

function removeAllCart(){
    navigator.notification.confirm(
        'Are you sure you want to delete the all products?', 
        function(buttonIndex){
            deleteAllCart(buttonIndex);
        },
        'Delete All Products!',
        ['Delete','Cancel']
    );
}

function onSignUp(){
    addNewUser($('#user_name').val(), $('#firm_name').val(), $('#phone_number').val());
}

function userControl(){
    $('#content').empty();

    loadingDiv();
    search_val = "";
    div_template = "";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'userControl',
            device_id : device.uuid,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {

            if(result == false){
                div_template += '<div>';
                div_template += '<div id="signUpDiv">';
                div_template += '<h1>Sign Up</h1>';
                div_template += '</div>';
                div_template += '<div id="user_nameDiv">';
                div_template += '<input id="user_name" type="text" placeholder="Name" class="signUp" data-mini="true">';
                div_template += '</div>';
                div_template += '<div id="firm_nameDiv">';
                div_template += '<input id="firm_name" type="text" placeholder="Firm Name" class="signUp" data-mini="true">';
                div_template += '</div>';
                div_template += '<div id="phone_numberDiv">';
                div_template += '<input id="phone_number" type="number" placeholder="555 555 55 55" class="signUp" data-mini="true">';
                div_template += '</div>';
                div_template += '<input type="button" name="" id="signUp" value="Sign Up" class="ui-btn" onClick="javascript:onSignUp();" disabled>';
                div_template += '</div>';

                $('#content').html(div_template);
                $('.signUp').textinput();

            } else{
                getCategories();
                getCartProducts();
            }

            loading_screen_open = 0;
        },
        error: function (data, status, error) {
            errorDiv();
            loading_screen_open = 0;
        }
    });
}

function addNewUser(user_name, firm_name, phone_number){
    $('#content').empty();

    loadingDiv();
    search_val = "";
    div_template = "";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'addNewUser',
            user_name : user_name, 
            firm_name : firm_name,
            phone_number : phone_number,
            device_id : device.uuid,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            getCategories();

            loading_screen_open = 0;
        },
        error: function (data, status, error) {
            errorDiv();
            loading_screen_open = 0;
        }
    });
}

function getCategories(){
    $('#content').empty();
    $('#navbar').empty();

    loadingDiv();
    search_val = "";
    div_template = "";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getCategories',
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            $('#content').attr('hidden','true');

            back_page = "";
            back_page_val = "";

            div_template += '<ul id="listview" class="ui-listview">';
            $.each(result, function(key, value) {
                div_template += '<li><a onClick="javascript:getProducts('+value['category_id']+');">';
                div_template += '<img src="images/categories/'+value['category_image']+'" width="100%" style="margin: 10% 0 10% 0" >';
                div_template += '<h6><span class="category_name">'+value['category_name']+'</span></h6>';
                div_template += '</a></li>';
            });
            div_template += '</ul>';

            $('#navbar').navbar("destroy");
            $('#navbar').html(div_template);
            $('#navbar').navbar();

            loading_screen_open = 0;
        },
        error: function (data, status, error) {
            errorDiv();
                
            loading_screen_open = 0;
        }
    });
}

function getProducts(category_id){
    $('#content').empty();
    $('#content').removeAttr('hidden');
    $('#navbar').empty();

    loadingDiv();
    search_val = "";
    div_template ="";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getProducts',
            category_id: category_id,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            back_page = "getCategories";
            back_page_val = "";

            div_template += '<ul data-role="listview" id="listview">';
            $.each(result, function(key, value) {
                div_template += '<li data-icon="false"><a onClick="javascript:getProductDetail('+value['product_id']+');">';
                div_template += '<img src="images/products/'+value['product_image']+'" width="100%" style="margin-top: 3%">';
                div_template += '<h2 style="margin-top: 6%;"><span style="font-size: 12pt;">'+value['product_name']+'</span></h2>';
                div_template += '</a></li>';
            });
            div_template += '</ul>';

            $('#content').html(div_template);

            loading_screen_open = 0;

            $( "#listview" ).listview({
                hideDividers: true
            });

        },
        error: function (data, status, error) {
            errorDiv();

            loading_screen_open = 0;
        }
    });
}

function getProductSearch(product_name){
    $('#content').empty();
    $('#content').removeAttr('hidden');
    $('#navbar').empty();

    loadingDiv();
    search_val = product_name;
    div_template ="";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getProductSearch',
            product_name: product_name,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            back_page = "getCategories";
            back_page_val = "";

            if(result != ""){

                div_template += '<ul data-role="listview" id="listview">';
                $.each(result, function(key, value) {
                    div_template += '<li data-icon="false"><a onClick="javascript:getProductDetail('+value['product_id']+');">';
                    div_template += '<img src="images/products/'+value['product_image']+'" width="100%">';
                    div_template += '<h2 style="margin-top: 6%;"><span style="font-size: 12pt;">'+value['product_name']+'</span></h2>';
                    div_template += '</a></li>';
                });
                div_template += '</ul>';

                $('#content').html(div_template);

                $( "#listview" ).listview({
                    hideDividers: true
                });

            } else{

                div_template += '<div style="padding: 20px; background-color: #ff9800; color: white"> ';
                div_template += 'No Search Result!';
                div_template += '</div>';

                $('#content').html(div_template);
            }

            loading_screen_open = 0;

            $( "#search-panel" ).panel( "close" );
            $( "#search" ).val("");
        },
        error: function (data, status, error) {
            errorDiv();

            loading_screen_open = 0;
        }
    });
}

function getProductDetail(product_id){
    $('#content').empty();
    $('#content').removeAttr('hidden');
    $('#navbar').empty();

    loadingDiv();
    div_template ="";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getProductDetail',
            product_id: product_id,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            if(search_val == ""){
                back_page = "getProducts";
                back_page_val = result[0]['category_id'];
            } else{
                back_page = "getProductSearch";
                back_page_val = search_val;
            }
                
            div_template += '<div>';
            div_template += '<div id="productDetailNameDiv">';
            div_template += '<p>'+result[0]['product_name']+'</p>';
            div_template += '</div>';
            div_template += '<div id="productDetailImageDiv">';
            div_template += '<img src="images/products/'+result[0]['product_image']+'" alt="" width="50%">';
            div_template += '<p style="font-size: 10pt">'+result[0]['description']+'</p>';
            div_template += '</div>';
            div_template += '<div id="unitDiv">';
            div_template += '<div style="width:20%; float: left;">';
            div_template += '<a id="unitMinus" class="ui-btn ui-icon-minus ui-btn-icon-notext ui-nodisc-icon" style="background-color: #16C4BB; border-width: 0; padding: 10%;"></a>';
            div_template += '</div>';
            div_template += '<div style="width:40%; margin: 0 7% 0 0; float: left;">';
            div_template += '<input id="unit" type="number" name="" min="0" value="100">';
            div_template += '</div>';
            div_template += '<div style="width: 20%; float: left;">';
            div_template += '<a id="unitPlus" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-nodisc-icon" style="background-color: #16C4BB; border-width: 0; padding: 10%;"></a>';
            div_template += '</div>';
            div_template += '</div>';
            div_template += '<input type="button" name="" id="addCart" value="Add To Cart" onClick="javascript:addToCart('+result[0]['product_id']+');" class="ui-btn">';
            div_template += '</div>';

            $('#content').html(div_template);
            $('#unit').textinput();

            loading_screen_open = 0;
        },
        error: function (data, status, error) {
            errorDiv();

            loading_screen_open = 0;
        }
    });
}

function addToCart(product_id){
    search_val = "";

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'addToCart',
            product_id : product_id,
            unit : $('#unit').val(),
            device_id : device.uuid,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
        	if(cart_loading_screen_open == 0){
        		getCartProducts();
        	}
        },
        error: function (data, status, error) {

        }
    });
}

function getCartProducts(){
    $('#cart-panel').empty();
    search_val = "";
    div_cart_template = "";
    cart_loading_screen_open = 1;
    var cartEmpty = 1;

    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getCartProducts',
            device_id : device.uuid,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
        	div_cart_template += '<h2 id="cart-label" style="text-align: center; width: 87%; float: left;">CART</h2>';
            if(result != ""){
            	cartEmpty = 0;
            	div_cart_template += '<a onClick="javascript:removeAllCart();" class="ui-btn ui-icon-alert ui-btn-icon-notext ui-nodisc-icon" style="background-color: transparent; border-width: 0; box-shadow: none; margin-top: 8%; margin-right: 3%;"></a>';
                div_cart_template += '<ul data-role="listview" id="panel_listview">';
                $.each(result, function(key, value) {
                    div_cart_template += '<li data-icon="false"><a onClick="javascript:removeProductCart('+value['cart_id']+',\''+value['product_name']+'\');">';
                    div_cart_template += '<img src="images/products/'+value['product_image']+'" width="100%" style="margin-top: 4%">';
                    div_cart_template += '<h2 style="margin-top: 7%;"><span style="font-size: 12pt;">'+value['product_name']+'</span></h2>';
                    div_cart_template += '<p><span style="font-size: 8pt">'+value['unit']+'</span></p>';
                    div_cart_template += '</a></li>';
                });
                div_cart_template += '<li data-icon="false"><a onClick="javascript:sendMail();">';
                div_cart_template += '<h2 style="margin-top: 3%; text-align: center"><span style="font-size: 14pt; color: #16C4BB">Send Mail</span></h2>';
                div_cart_template += '</a></li>';
                div_cart_template += '</ul>';
            } else{
            	cartEmpty = 1;
                div_cart_template += '<hr>';
                div_cart_template += '<h2 style="text-align: center; margin-top: 40%;">Cart is Empty!</h2>';
            }
            
            $('#cart-panel').html(div_cart_template);

            $( "#panel_listview" ).listview({
                hideDividers: true
            });
            (cartEmpty == 1) ? $('#cart-label').css("width","100%") : "";
            cart_loading_screen_open = 0;
        },
        error: function (data, status, error) {    
            div_cart_template = "";

            div_cart_template += '<div style="padding: 20px; background-color: #ff9800; color: white"> ';
            div_cart_template += '<strong>Oops!</strong> We\'re Sorry. <br>Something went wrong. <br>We\'re working on it now.';
            div_cart_template += '</div>';

            $('#cart-panel').html(div_cart_template);
            cart_loading_screen_open = 0;
        }
    });
}

function deleteCartProduct(buttonIndex,cart_id){
    if(buttonIndex == 1){
        $.ajax({
            type: "POST",
            url: 'http://cordova.atwebpages.com/actions_commerce.php',
            data: {
                process : 'deleteCartProduct',
                cart_id : cart_id,
            },
            dataType: 'json',
            cache: false,
            success: function (result) {
            	if(cart_loading_screen_open == 0){
        			getCartProducts();
        		}
            },
            error: function (data, status, error) {
                errorDiv();
            }
        });
    }
}

function deleteAllCart(buttonIndex){
    if(buttonIndex == 1){
        $.ajax({
            type: "POST",
            url: 'http://cordova.atwebpages.com/actions_commerce.php',
            data: {
                process : 'deleteAllCart',
                device_id : device.uuid,
            },
            dataType: 'json',
            cache: false,
            success: function (result) {
                if(cart_loading_screen_open == 0){
        			getCartProducts();
        		}
            },
            error: function (data, status, error) {
                errorDiv();
            }
        });
    }
}

function sendMail(){
    var mail_body = "";
    $.ajax({
        type: "POST",
        url: 'http://cordova.atwebpages.com/actions_commerce.php',
        data: {
            process : 'getUserProducts',
            device_id : device.uuid,
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            mail_body += '<h1>Unit - Product Name</h1>';
            mail_body += '<br>';
            $.each(result, function(key, value) {
                mail_body += '<span>'+value['unit']+' - '+value['product_name']+'</span><br>';
            });
            mail_body += '<br><br><br>';
            mail_body += '<span>Firm Name: '+result[0]['firm_name']+'</span><br>';
            mail_body += '<span>Name: '+result[0]['user_name']+'</span><br>';
            mail_body += '<span>Phone Number: '+result[0]['phone_number']+'</span><br>';

            cordova.plugins.email.open({
                to:      'mustafagultekin2013@gmail.com',
                cc:      '',
                bcc:     ['', ''],
                subject: result[0]['user_name']+"'s Wishlist",
                body:    mail_body,
                isHtml:  true
            });
        },
        error: function (data, status, error) {

        }
    });
}

function loadingDiv(){
    loading_screen_open = 1;
    back_page = "";
    back_page_val = "";
    div_template = "";

    div_template += '<div id="loading_div" style="top: 45%; left: 45%; position: absolute;">';
    div_template += '<img src="images/loading.gif">';
    div_template += '</div>';

    $('#content').html(div_template);
}

function errorDiv(){
    $('#content').empty();
    $('#navbar').empty();

    div_template = "";

    div_template += '<div style="padding: 20px; background-color: #ff9800; color: white"> ';
    div_template += '<strong>Oops!</strong> We\'re Sorry. <br>Something went wrong. <br>We\'re working on it now.';
    div_template += '</div>';

    $('#content').html(div_template);
}

