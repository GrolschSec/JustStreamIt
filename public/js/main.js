url = "http://127.0.0.1:8000/api/v1/titles";

function fetchModal(id, element){

	let img_div = element.getElementsByClassName("modal__img")[0];
	let content = element.getElementsByClassName("modal__data")[0];
	let info = {
		"imdb_score": 'IMDB Score: ',
		"avg_vote": 'Box office: ',
		"duration": 'Duration (min): ',
		"date_published": 'Release Date: ',
		"rated": 'Rated: ',
		"description": 'Description: '
	}
	let single_list = {
		"directors" : "Director: ",
		"countries" : "Country: "
	}
	let multiple_list = {
		"actors": "Actors: ",
		"genres": "Genres: ",
	}


	fetch(url + '/' + id)
	.then(response => response.json())
	.then(data => {
		img_div.appendChild(document.createElement('img'))
		.setAttribute('src', data['image_url']);
		content.appendChild(document.createElement('h1'))
		.textContent = data['title'];
		for (const [key, value] of Object.entries(info)) {
			content.appendChild(document.createElement('p'))
			.setAttribute('class', `modal__${key}`);
			content.getElementsByClassName(`modal__${key}`)[0]
			.textContent = `${value}${data[key]}`;
		}
		for (const [key, value] of Object.entries(single_list)) {
			content.appendChild(document.createElement('p')).textContent = `${value}${data[key][0]}`;
		}
		let i = 0;
		let list_el = ''
		for (const [key, value] of Object.entries(multiple_list)){
			content.appendChild(document.createElement('hx')).textContent = `${value}`;
			content.appendChild(document.createElement('ul'))
			list_el = content.getElementsByTagName('ul')[i];
			for (const x of data[key]) {
				 list_el.appendChild(document.createElement('li')).textContent = x;
			}
			i++;
		}
	});
}

function openModal(id, element){

	let modal = element.getElementsByClassName('modal')[0];
	modal.innerHTML = "<div class='modal__content'><div class='modal__data'></div><div class='modal__img-cls'><div class='modal__img'></div><span class='modal--close'>&times</span></div><div/>";
	fetchModal(id, modal);
	let span = element.getElementsByClassName('modal--close')[0];


	modal.classList.add("modal--show");
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.classList.remove("modal--show");
			modal.innerHTML = ""
		}
	};
	span.onclick = function(){
		modal.classList.remove("modal--show");
		modal.innerHTML = ""
	};
}

function fetchBestRatedMovie(){
	
	let bestMovie = document.getElementsByClassName("best-movie")[0];
	bestMovie.innerHTML = "<div class='best-movie__content'><h1></h1><button class='modal__button'>More info.</button><p></p></div><div class='best-movie__img'><img></div><div class='modal'></div></div>";
	let title = bestMovie.getElementsByTagName('h1')[0];
	let img = bestMovie.querySelector("div > img");
	let description = bestMovie.getElementsByTagName('p')[0];
	let btn = bestMovie.getElementsByClassName('modal__button')[0];
	

	fetch(url + "?sort_by=-imdb_score")
		.then(response => response.json())
		.then(data => {
			fetch(url + '/' + data['results'][0]['id'])
			.then(response => response.json())
			.then(data => {
				title.textContent = data['title'];
				img.setAttribute("src", data['image_url']);
				description.textContent = data['description'];
				btn.addEventListener('click', event => {
					openModal(data['id'], bestMovie);
				})
			});
	});
}

async function fetchCategory(categoryName = '', i = 0){

	const response = await fetch(url + '?sort_by=-imdb_score' + '&genre=' + categoryName);
	const data = await response.json()
	let categoryData = Array(...data.results);


	if (i > 0)
        categoryData.splice(0, i);
	if (categoryData.length < 7){
		let data2 = await (await fetch(data.next)).json();
        categoryData.push(...Array(...data2.results).slice(0, 7 - categoryData.length));
	}
	return categoryData
}

console.log(fetchCategory('', 1), fetchCategory('action'), fetchCategory('biography'), fetchCategory('historic'));
fetchBestRatedMovie();