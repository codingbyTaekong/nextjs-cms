
export interface GymData {
    idx : number
    gym_name : string
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
    review_rate: number
    review_text: string
    review_writer: string
    created_at: string
}



