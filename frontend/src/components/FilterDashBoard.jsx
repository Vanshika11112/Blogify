import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SortIcon from '@mui/icons-material/Sort';

const FilterDashBoard = ({setFilter, filter, sortOrder, setSortOrder}) => {
    return (
        <>
            <div className="flex items-center gap-1">
                <FilterAltIcon style={{ fontSize: "22px" }} />
                <h1 className="text-xl tracking-wider">Filters</h1>
            </div>
            <div>
                <ul className="flex flex-col gap-4">
                    <li onClick={() => setFilter("Fitness")} className={filter !== "Fitness" ? "tracking-wider text-lg rounded-sm px-2 cursor-pointer hover:bg-black hover:text-white" : "tracking-wider text-lg rounded-sm px-2 cursor-pointer bg-black text-white"}>Fitness</li>
                    <li onClick={() => setFilter("Music")} className={filter !== "Music" ? "tracking-wider text-lg rounded-sm px-2 cursor-pointer hover:bg-black hover:text-white" : "tracking-wider text-lg rounded-sm px-2 cursor-pointer bg-black text-white"}>Music</li>
                    <li onClick={() => setFilter("Movies")} className={filter !== "Movies" ? "tracking-wider text-lg rounded-sm px-2 cursor-pointer hover:bg-black hover:text-white" : "tracking-wider text-lg rounded-sm px-2 cursor-pointer bg-black text-white"}>Movies</li>
                    <li onClick={() => setFilter("Sports")} className={filter !== "Sports" ? "tracking-wider text-lg rounded-sm px-2 cursor-pointer hover:bg-black hover:text-white" : "tracking-wider text-lg rounded-sm px-2 cursor-pointer bg-black text-white"}>Sports</li>
                </ul>
            </div>
            <div className="flex items-center">
                <div className="flex-1 flex items-center gap-1 cursor-pointer justify-center border-r-2 text-[red] hover:text-white py-1 hover:bg-[black]" title="Remove Filters" onClick={() => setFilter("")}>
                    <FilterAltOffIcon style={{ fontSize: "18px" }} />
                    <p className="tracking-wider text-sm">Remove Filters</p>
                </div>
                <div className="flex-1 flex items-center gap-1 cursor-pointer justify-center text-[seagreen] py-1 hover:bg-black hover:text-white" title="Sort By Newest Blogs" onClick={() => setSortOrder(!sortOrder)}>
                    <SortIcon style={{ fontSize: "18px" }} />
                    <p className="text-sm tracking-wider">{!sortOrder ? "Newest" : "Oldest"}</p>
                </div>
            </div>
        </>
    )
}

export default FilterDashBoard