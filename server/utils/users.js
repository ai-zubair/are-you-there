class Users {
    constructor(){
        this.users = []
    }
    addUser(user_id,username,room_name){
        const newUser = {
            id:user_id,
            name: username,
            room: room_name
        }
        this.users.push(newUser);
        return newUser;
    }
    removeUser(user_id){
        const user = this.getUser(user_id);
        if(user){
            return this.users.splice(this.users.findIndex( user => user.id === user_id),1)[0]
        }
    }
    getUser(user_id){
        return this.users.filter( user => user.id === user_id )[0];
    }
    getUserList(room_name){
        return this.users.filter( user => user.room === room_name ).map( user => user.name );
    }
}

module.exports = {
    Users
}