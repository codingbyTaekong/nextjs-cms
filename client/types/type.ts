
export interface GymData {
    idx : number
    place_id : number
    gym_name : string
    gym_type : string
    gym_address : string
    gym_latitude : string
    gym_longitude : string
    gym_info : string
    average_rate : string
    reviews : Array<Review>
    created_at : string
    updated_at : string
}

export interface Review {
    idx: number
    gym_id: number
    review_type : "img" | "text"
    review_select : string
    review_imgs : string
    review_rate: number
    review_text: string
    review_writer: string
    created_at: string
}




export interface KakaoMapData {
    address_name: string
    category_group_code: string
    category_group_name: string
    category_name: string
    distance: string
    id: string
    phone: string
    place_name: string
    place_url: string
    road_address_name: string
    x: string
    y: string
}