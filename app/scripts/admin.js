var Admin = (function(){
	var users;
	var games;
	var user;

	if (Modernizr.localstorage) {
		if(localStorage.ttt){
			var ttt = JSON.parse(localStorage.ttt);
			users = ttt.users;
			console.log(users);
			games = ttt.games;
			console.log(games);
		}else{
			users = [];
			games = [];
		}
	} else {
		bootbox.alert("Upgrade your browser");
	}

	function signup(u){
		if(_.find(users,function(user){return user.username === u.username;})){
			bootbox.alert('user exists.');
			return false;
		}else{
			users.push(u);
			bootbox.alert(u.username + ' sign up successfully.',function(){
				signin(u);
			});
			return true;
		}
	}

	function signin(u){
		if(user){
			bootbox.alert(u.username + ' already signed in');
			return;
		}
		if(_.find(users,function(user){return user.username === u.username && user.password === u.password;})){
			bootbox.alert('user sign in successfully.');
			user = u;
			return true;
		}else{
			bootbox.alert('user and password does not match');
			return false;
		}
	}

	function signout(){
		if(!user){
			bootbox.alert('no user signed in.');
		}else{
			console.log(user);
		}
		user = null;
	}

	function dirty(){
		localStorage.ttt = JSON.stringify({users:users,games:games});
	}

	function clean(){
		localStorage.ttt = null;
	}

	return {
		users:users
	, user:user
	, games:games
	, dirty:dirty
	, clean:clean
	, signup:signup
	, signin:signin
	, signout:signout
	};

})();

