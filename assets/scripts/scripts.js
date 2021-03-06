function getApi(){
    var requestUrlHardcoverNonFiction="https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=GXs6gx2gnZLiyA8GGEdALLBnQEC8Ak1w";
    fetch(requestUrlHardcoverNonFiction)
        .then(function (response) {
            return response.json();
            
        })
        .then (function (data){
            console.log(data);
            for (var i=0; i<5; i++){
            $("#bestSellerImg"+i).attr("src", data.results.books[i].book_image);
            $("#bestSellerTitle"+i).text(data.results.books[i].title);
            $("#bestSellerSynopsis"+i).text(data.results.books[i].description);
            $("#moreInfo"+i).attr("href", data.results.books[i].amazon_product_url);
            }    
        });
    };
    
$( document ).ready(function(){
    getApi();
});


