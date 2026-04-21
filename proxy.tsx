import { NextResponse,NextRequest } from "next/server";
export default async function proxy(request:NextRequest){
    const token = request.cookies.get('token')?.value;
    if(!token){
        return NextResponse.redirect(new URL('/auth/signin',request.url))
    }
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`,{
            headers:{
                Authorization:`Token ${token}`
            }
        })
        if(!response.ok){
            throw new Error('Unauthorized')
        }
        return NextResponse.next();
    }
    catch{
        return NextResponse.redirect(new URL('/auth/signin',request.url))
    }
}
export const config = {
    matcher:[
        "/dashboard",
        "/dashboard/budget",
    ]
}