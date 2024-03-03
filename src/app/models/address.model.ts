export class Address {
    
    constructor(
        public id: string,
        public user_id: string,
        public title: string,
        public address: string,
        public landmark: string,
        public house: string,
        public lat: number,
        public lng: number
    ) {}

}