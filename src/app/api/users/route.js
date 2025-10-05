import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const searchType = searchParams.get('searchType') || 'name';
        const bloodGroup = searchParams.get('bloodGroup');
        const availability = searchParams.get('availability');

        const client = await clientPromise;
        const db = client.db('blood_donor');
        const collection = db.collection('users');

        let query = {};

        // Text search based on search type
        if (search) {
            switch (searchType) {
                case 'name':
                    query.name = { $regex: search, $options: 'i' };
                    break;
                case 'id':
                    query.studentId = { $regex: search, $options: 'i' };
                    break;
                case 'location':
                    query.address = { $regex: search, $options: 'i' };
                    break;
                case 'bloodGroup':
                    query.bloodGroup = { $regex: search, $options: 'i' };
                    break;
                default:
                    query.$or = [
                        { name: { $regex: search, $options: 'i' } },
                        { studentId: { $regex: search, $options: 'i' } },
                        { address: { $regex: search, $options: 'i' } },
                        { bloodGroup: { $regex: search, $options: 'i' } }
                    ];
            }
        }

        // Blood group filter
        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        // Availability filter
        if (availability === 'available') {
            query.isAvailable = true;
        } else if (availability === 'unavailable') {
            query.isAvailable = false;
        }

        const users = await collection.find(query).sort({ name: 1 }).toArray();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const userData = await request.json();
        const client = await clientPromise;
        const db = client.db('blood_donor');
        const collection = db.collection('users');

        // Check if user already exists
        const existingUser = await collection.findOne({ email: userData.email });

        if (existingUser) {
            // Update existing user
            const result = await collection.updateOne(
                { email: userData.email },
                { $set: userData }
            );
            return NextResponse.json({ message: 'User updated successfully', result });
        } else {
            // Insert new user
            const result = await collection.insertOne(userData);
            return NextResponse.json({ message: 'User created successfully', result });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}