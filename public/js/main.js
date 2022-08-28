url = "http://127.0.0.1:8000/api/v1/titles";


function fetchBestRatedMovie(){
	
	let bestMovie = document.getElementsByClassName("best-movie")[0];
	bestMovie.innerHTML = "<div class='best-movie__content'><h1></h1><button class='modal-button'>More info.</button><p></p></div><div class='best-movie__img'><img></div></div>"
	let title = bestMovie.getElementsByTagName('h1')[0];
	let img = bestMovie.querySelector("div > img");
	let description = bestMovie.getElementsByTagName('p')[0];
	let btn = bestMovie.getElementsByClassName('modal-button');
	

	fetch(url + "?sort_by=-imdb_score")
		.then(response => response.json())
		.then(data => {
			fetch(url + '/' + data['results'][0]['id'])
			.then(response => response.json())
			.then(data => {
				title.textContent = data['title'];
				img.setAttribute("src", data['image_url']);
				description.textContent = data['description'];
			});
		});
}


fetchBestRatedMovie();