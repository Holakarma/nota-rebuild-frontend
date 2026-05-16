import { noteQueries } from "@entities/note";
import { useThrottledState } from "@shared/lib/useThrottledState";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

type SearchResultProps = {
    query?: string;
};

const SEARCH_THROTTLE_MS = 500;
const MAX_SEARCH_QUERY_LENGTH = 500;

const normalizeSearchQuery = (query: string) =>
    query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH);

export const useSearch = ({ query = '' }: SearchResultProps) => {
    const normalizedQuery = normalizeSearchQuery(query);

    const throttledQuery = useThrottledState(
        normalizedQuery,
        SEARCH_THROTTLE_MS,
    );

    return useQuery({
        ...noteQueries.similar({ query: throttledQuery }),
        enabled: Boolean(normalizedQuery && throttledQuery),
        placeholderData: keepPreviousData,
    });
}