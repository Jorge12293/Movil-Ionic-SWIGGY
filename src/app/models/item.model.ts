export class Item {

    constructor(
        public id: string,
        public category_id: string,
        public uid: string,
        public cover: string,
        public name: string,
        public desc: string,
        public price: number,
        public rating: number,
        public status: boolean,
        public variation: boolean,
        public veg: boolean,
        public quantity: number
    ) {}

}
