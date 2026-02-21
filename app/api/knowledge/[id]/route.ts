import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeItemById, updateKnowledgeItem, deleteKnowledgeItem } from '@/lib/queries';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await context.params;
        const itemId = parseInt(resolvedParams.id, 10);
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const body = await req.json();

        // Perform the partial update
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
    try {
        const resolvedParams = await context.params;
        const itemId = parseInt(resolvedParams.id, 10);
        if (isNaN(itemId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const existingItem = await getKnowledgeItemById(itemId);
        if (!existingItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        const deleted = await deleteKnowledgeItem(itemId);

        if (!deleted) {
            return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete knowledge item:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
