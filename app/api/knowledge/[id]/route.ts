import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeItemById, updateKnowledgeItem, deleteKnowledgeItem } from '@/lib/queries';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resolvedParams = await context.params;
        const itemId = parseInt(resolvedParams.id, 10);
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();

        // Perform the partial update. Note: We only allow updating if it belongs to the user
        // We ensure it belongs to the user by passing user_email to the update
        body.user_email = session.user.email;
        const updatedItem = await updateKnowledgeItem(itemId, body);

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found or no updates provided' }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error('Failed to update knowledge item:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const resolvedParams = await context.params;
        const itemId = parseInt(resolvedParams.id, 10);
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const existingItem = await getKnowledgeItemById(itemId, session.user.email);
        if (!existingItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const deleted = await deleteKnowledgeItem(itemId, session.user.email);

        if (!deleted) {
            return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete knowledge item:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
