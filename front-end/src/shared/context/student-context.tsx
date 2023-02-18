import React, { createContext, useEffect, useReducer, useState } from 'react';
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { ascending, descending, debounce } from 'shared/helpers/utils';

interface StudentContextType {
    handleFilter: (e: string) => void
    handleSort: () => void
    onSortBy: () => void
    data: {
        students: Person[]
    } | undefined,
    loadState: string,
    sortBy: string,
    sortType: string,
}

export const StudentContext = createContext<StudentContextType>({
    handleFilter: (e: string) => { },
    handleSort: () => { },
    onSortBy: () => { },
    loadState: '',
    data: {
        students: [] as Person[]
    },
    sortBy: '',
    sortType: '',
});

interface StudentProviderProps {
    children: React.ReactNode,
}

export default function StudentProvider({ children }: StudentProviderProps) {
    const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" });
    const [filteredData, setFilteredData] = useState<{ students: Person[] }>()
    const [sortBy, setSortBy] = useState('first_name');
    const [sortType, setSortType] = useState('');

    useEffect(() => {
        void getStudents()
    }, [getStudents])

    useEffect(() => {
        setFilteredData(data)
    }, [data])

    const handleSort = () => {
        const newSortType = sortType === 'ascending' ? 'descending' : 'ascending';
        if (sortType === 'ascending') {
            setFilteredData(ascending(filteredData as { students: Person[] }, sortBy as keyof Person))
        } else {
            setFilteredData(descending(filteredData as { students: Person[] }, sortBy as keyof Person))
        }
        setSortType(newSortType);
    }

    const onSortBy = () => {
        const newSortBy = sortBy === 'first_name' ? 'last_name' : 'first_name';
        setSortBy(newSortBy)
    }

    const handleFilter = debounce((filterBy: string) => {
        const postData = { ...filteredData };
        if (filterBy) {
            postData.students = data?.students.filter(student => PersonHelper.getFullName(student).toLowerCase().includes(filterBy.toLowerCase()))
        } else {
            postData.students = data?.students;
        }
        setFilteredData(postData as { students: Person[] })
    }, 1000)

    const value = {
        data: filteredData,
        loadState,
        handleSort,
        sortBy,
        sortType,
        onSortBy,
        handleFilter,
    }


    return <StudentContext.Provider value={value}>
        {children}
    </StudentContext.Provider>
}