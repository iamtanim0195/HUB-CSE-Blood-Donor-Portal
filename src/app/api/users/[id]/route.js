import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Validate the ID format
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('blood_donor');
        const collection = db.collection('users');

        // Convert string ID to MongoDB ObjectId
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'User deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}