interface GraphFilterProps {
    filterData: {
        label: string,
        filters: Array<string>
    },

    activeFilters: Array<string>,

    onUpdateActive: (arg0 : string) => void,
}

export default function GraphFilter({ filterData, activeFilters, onUpdateActive } : GraphFilterProps) {

    function isActive(currentFilter : string) {
        if (filterData.label === 'Pod' && currentFilter === 'All' && activeFilters.length === 0) {
            return true;
        }

        return activeFilters.includes(currentFilter.toLowerCase());
    }

    return (
        <div>
            <div className="mb-2 text-sm text-stone-300">{filterData.label}</div>
            <div className="flex gap-3 font-bold">
                {
                    filterData.filters.map((filter : string) => (
                        <div
                            onClick={() => onUpdateActive(filter.toLowerCase())}
                            key={filter}
                            className={`cursor-pointer hover:border-b-1 ${isActive(filter) ? 'border-b-1' : ''}`}
                        >
                            {filter}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
