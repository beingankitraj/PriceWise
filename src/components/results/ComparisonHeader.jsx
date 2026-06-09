import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComparisonHeader({ query, resultsCount, onSave, isSaving }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Results for "{query}"
        </h2>
        <p className="text-zinc-500">
          Found {resultsCount} prices from different stores
        </p>
      </div>
      <Button
        onClick={onSave}
        disabled={isSaving}
        variant="outline"
        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
      >
        <Bookmark className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}