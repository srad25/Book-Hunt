// Declared Variables
var wishListArray = [];
var searchResultsArray = [];

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
    displayURLbyID("mainSection");
    getApi();
});


function googleBooksApi(){
    displayURLbyID("searchresults");
    var searchInputAuthorSubstring = "";
    var searchInputTitleSubstring="";

    if( $("#searchInputAuthor").val()){
        searchInputAuthorSubstring = "+inauthor:" + $("#searchInputAuthor").val();
    }
    if( $("#searchInputTitle").val()){
        searchInputTitleSubstring =  $("#searchInputTitle").val();
    }

    var requestGoogleBookspi = "https://www.googleapis.com/books/v1/volumes?q="+searchInputTitleSubstring+searchInputAuthorSubstring+"&key=AIzaSyAl-vJ09UrVHn5AE-KZ8HOqGiwx5UOqQ50";
    console.log(requestGoogleBookspi);

    fetch(requestGoogleBookspi)
        .then(function (response) {
            return response.json();
            
        })
        .then (function (data){
            console.log(data);
            var htmltable="";
            for (var i=0; i<data.items.length; i++){

                htmltable+=`<tr><td><img id="googleBooksCover" src=${data.items[i].volumeInfo?.imageLinks?.smallThumbnail?data.items[i].volumeInfo?.imageLinks?.smallThumbnail:""}> </img> </td>
                <td id="googleBooksTitle"> ${data.items[i].volumeInfo?.title}</td>
                <td id="googleBooksAuthor">${data.items[i].volumeInfo?.authors?.toString()} </td>
                <td id="googleBooksRating"> ${data.items[i].volumeInfo?.averageRating?data.items[i].volumeInfo?.averageRating:"N/A"}</td></tr>`
               }  
            $("#displayResults").html(htmltable);
  
        });
       
       
    };
    function displayURL()
    {
       var attributevalue=this.getAttribute("data-attribute");
       displayURLbyID(attributevalue);
    }
    function displayURLbyID(attributevalue)
    {
        $("#searchresults").attr("style","display:none");
        $("#wishlist").attr("style","display:none");
        $("#detailspage").attr("style","display:none");
        $("#mainSection").attr("style","display:none");
        $("#"+attributevalue).attr("style","display:block");

    }


$("#searcBtn").on("click",googleBooksApi);
$("#home").on("click",displayURL);
$("#wishlistlink").on("click",displayURL);
//$(".btnMoreInfo").on("click",displayURL);


