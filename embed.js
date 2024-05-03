import { html, render, useState, useEffect } from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

let container = document.createElement("div");
container.id = "tierra-lista-embed"

document.querySelector("#tierra-lista-script").after(container);

const Styles = () => {
    return html`
        <style>



            .tierra-lista-container {
                margin: 0 auto;
                padding: 1rem;
                // max-width: 900px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
            }

            .tierra-lista-container .title {
                font-size: 3.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }

            .tierra-lista-container .form-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 1rem;
            }

            .tierra-lista-container .advancedSearch {
                display: flex;
                flex-direction: column;
                margin-bottom: 1rem;
                width:100%;
                align-items: flex-start;
            }

            .tierra-lista-container .form-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: 1rem;
                width: 100%;
                align-items: center;

            }

            .tierra-lista-container .form-indent{
                padding-left: 2rem;

            }



            .tierra-lista-container .form-row > .form-input {
                margin-right: 1rem;
                width: 200px;

            }

            .tierra-lista-container .form-select,
            .tierra-lista-container .form-input {
                border: 1px solid #ccc;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                outline: none;
                margin: 0.25rem;
                width: 25%;
            }

            .tierra-lista-container .form-button {
                background-color: #3490dc;
                color: #fff;
                font-weight: 600;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 0.25rem;
                outline: none;
                cursor: pointer;
                flex: 0 0 auto;
                transition: background-color 0.3s ease;
            }

            .tierra-lista-container .form-button:hover {
                background-color: #2779bd;
            }

            .tierra-lista-container .form-button-add,
            .tierra-lista-container .form-button-remove,
            .tierra-lista-container .form-button-or  {
                border-radius: 0;
                margin-left: -1px;
            }

            .tierra-lista-container .form-button-remove {
                background-color: #bf1f1f;
            }

            .tierra-lista-container .form-button-or {
                background-color: #449506;
            }

            .tierra-lista-container .form-button-or:hover {
                background-color: #408d05;
            }

            .tierra-lista-container .form-button-remove:hover {
                background-color: #9f0000;
            }

            .tierra-lista-container .form-submit {
                display: flex;
                justify-content: center;
                margin-top: 1rem;
            }

            .tierra-lista-container .form-button-submit {
                border-radius: 0.25rem;
                margin: 0 5px;

            }

            .tierra-lista-container .result {
                padding-top: 1rem;
                font-size: 1rem;
                font-family: inherit;
            }

            .tierra-lista-container .properties {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
            }

            .tierra-lista-container .property {
                background-color: #fff;
                padding: 1rem;
                border-radius: 1rem;
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
                margin: 1rem;
                width:45%;
            }

            .tierra-lista-container .property-title {
                font-size: 1.25rem;
                font-weight: 600;
                font-family: inherit;
            }

            .tierra-lista-container .property-description {
                color: #666;
                font-size: 1rem;
                font-family: inherit;
            }

            .tierra-lista-container .property-location {
                color: #888;
                margin-top: 0.5rem;
                font-size: 1rem;
                font-family: inherit;
            }

            .tierra-lista-container .property:hover {
                box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
            }


            .tierra-lista-container .tw-10{
                width: 10%
            }

            .tierra-lista-container .tw-25{
                width: 25%
            }


            @media only screen and (max-width: 600px) {
                .tierra-lista-container .property {
                    width: 80%;
                }

                .tierra-lista-container .form-submit {
                    flex-wrap: wrap;
                }
            }
        </style>
    `;
};

const BasicSearch = ({ setToggleSearch, setTotal, setListings }) => {
    const [formData, setFormData] = useState({
        street: '',
        barangay: '',
        municipality: '',
        province: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('https://api.presylord.com/v1/properties', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setListings(data.response.documents);
            setTotal(data.response.total);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value.trim() });
    };

    return html`
        <form class="form-container" onSubmit=${handleSubmit}>
            <div class="form-row">
                <input
                    type="text"
                    onChange=${handleChange}
                    name="street"
                    placeholder="Street"
                    class="form-input"
                />
                <input
                    type="text"
                    onChange=${handleChange}
                    name="barangay"
                    placeholder="Barangay"
                    class="form-input"
                />
                <input
                    type="text"
                    onChange=${handleChange}
                    name="municipality"
                    placeholder="Municipality"
                    class="form-input"
                />
                <input
                    type="text"
                    onChange=${handleChange}
                    name="province"
                    placeholder="Province"
                    class="form-input"
                />
                </div>
                <div>
                    <button
                        type="submit"
                        class="form-button form-button-submit"
                    >
                        Search Property
                    </button>
                    <button
                        type="submit"
                        class="form-button form-button-submit"
                        onClick=${()=> setToggleSearch(true)}
                    >
                        Advanced Search
                    </button>
                
                </div>
        </form>
    `;
};

const AdvancedSearch = ({ setToggleSearch, setTotal, setListings }) => {
    const [filterRows, setFilterRows] = useState([{match:'&', filter: [{field: 'Province', operator: 'is', value: '' }]}]);
    const [overAllCondition, setOverAllCondition] = useState('all')

    console.log(filterRows)
    const advancedRow = ({row, match, index, subIndex }) => {
        return html`
            <div key=${index} class="form-row ${match == '&' ? '' :'form-indent' }" >
                <select
                    class="form-select"
                    value=${row.field}
                    name="field"
                    onChange=${(e) => handleFieldChange(index, subIndex, e.target.name, e.target.value)}
                >
                    <option value="Province">Province</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Barangay">Barangay</option>
                    <option value="Street">Street</option>
                </select>
                <select
                    class="form-select tw-10"
                    value=${row.operator}
                    name="operator"
                    onChange=${(e) => handleFieldChange(index, subIndex, e.target.name, e.target.value)}
                >
                    <option value="is">is</option>
                    <option value="contains">contains</option>
                </select>
                <input
                    class="form-input"
                    value=${row.value}
                    name="value"
                    onChange=${(e) => handleFieldChange(index,subIndex, e.target.name, e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick=${ filterRows[index].match == '|' ? ()=>handleAddInOr(index) : handleAddRow }
                    class="form-button form-button-add"
                >
                    And
                </button>
                ${ filterRows[index].match == '&' && html`<button
                    type="button"
                    onClick=${handleOrRow}
                    class="form-button form-button-or"
                >
                    Or
                </button>`}
                <button
                        type="button"
                        onClick=${ filterRows[index].match == '|' ? ()=>handleRemoveInOr(index, subIndex) : ()=>handleRemoveRow(index) }
                        class="form-button form-button-remove"
                    >
                        Remove
                </button>
                
            </div>
        `
    }

    const handleAddRow = () => {
        setFilterRows([...filterRows, {match:'&', filter: [{field: 'Province', operator: 'is', value: '' }]}]);
    };

    
    const handleOrRow = () => {
        setFilterRows([...filterRows, {match:'|', filter: [{field: 'Province', operator: 'is', value: '' },{field: 'Province', operator: 'is', value: '' }]}]);
    };
    
    const handleRemoveRow = (index) => {
        const updatedRows = filterRows.filter((_, idx) => idx !== index);
        setFilterRows(updatedRows);
    };

    const handleAddInOr = (index) => {
        const updatedFilterRows = [...filterRows];

        // Update the filter in the copied array
        updatedFilterRows.forEach((row, i) => {
            if (i === index) {
            row.filter.push({ field: 'Province', operator: 'is', value: '' });
            }
        });

        // Set the state with the updated array
        setFilterRows(updatedFilterRows);
        
    };

    const handleRemoveInOr = (index, subIndex) => {
        const updatedFilterRows = filterRows.map((row, i) => {
            if (i === index) {
                const updatedFilter = row.filter.filter((_, idx) => idx !== subIndex);
                if (updatedFilter.length == 1){
                    return {match:'&', filter: updatedFilter }
                }
                return { ...row, filter: updatedFilter };
            }
            return row;
        });
    
        setFilterRows(updatedFilterRows);
    };

    const handleFieldChange = (index, subIndex, selectedField, selectedFieldValue) => {
        const updatedRows = [...filterRows];
        updatedRows[index].filter[subIndex][selectedField] = selectedFieldValue.trim();
        setFilterRows(updatedRows);
        console.log(index, subIndex)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requestBody = {
            overAllCondition: overAllCondition,
            conditions: filterRows
        }
        
        console.log(requestBody)

        try {
            const res = await fetch('https://api.presylord.com/v1/properties?action=advancedSearch', {
                method: 'POST',
                body: JSON.stringify({
                    advancedSearch: requestBody
                })
            });
            const data = await res.json();
            setListings(data.response.documents);
            setTotal(data.response.total);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    

    return html`
        <form class="form-container" onSubmit=${handleSubmit}>
            <div class="form-row" >
                
                    ${filterRows.length > 1 && html`<span>Match</span>
                        <select class="form-select tw-10" value=${overAllCondition} onChange=${(e)=> setOverAllCondition(e.target.value)} name="all_any">
                            <option value="all">all</option>
                            <option value="any">any</option>
                        </select>
                        <span style="margin-right: 1rem;"> of the following rules </span>`
                    }
                    ${filterRows.length == 0 && html`<button
                        type="button"
                        onClick=${()=>setFilterRows([{match:'&', filter: [{field: 'Province', operator: 'is', value: '' }]}, {match:'&', filter: [{field: 'Province', operator: 'is', value: '' }]}])}
                        class="form-button form-button-add"
                    >
                        Add Rule
                    </button>`}
                
            </div>
            <div class="advancedSearch">
                ${filterRows.map((filters, index) => {
                    const match = filters.match
                    return filters?.filter.map((row,i)=> html`
                        <${advancedRow} match=${match} row=${row} index=${index} subIndex=${i}/>
                    `)
                }
                    
                    )}
                <!-- Modify advanced Row for Or Row -->
            </div>
            <div class="form-submit">
                <button
                    type="submit"
                    class="form-button form-button-submit"
                >
                    Search Property
                </button>
                <button
                    type="button" onClick=${()=>setFilterRows([])}
                    class="form-button form-button-submit"
                >
                    Reset Filters
                </button>

                <button
                    type="button" onClick=${()=> setToggleSearch(false)}
                    class="form-button form-button-submit"
                >
                    Basic Search
                </button>
            </div>
        </form>
    `;
};

const publicClient = () => {
    const [listings, setListings] = useState([]);
    const [total, setTotal] = useState(0);
    const [toggleSearch, setToggleSearch] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('https://api.presylord.com/v1/properties');
                const data = await res.json();
                setListings(data.documents);
                setTotal(data.total);
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    }, []);

    return html`
        <${Styles}/>
        <div class="tierra-lista-container">
            <h1 class="title">Tierra Lista Properties</h1>
            <${ !toggleSearch && BasicSearch} setToggleSearch=${setToggleSearch} setTotal=${setTotal} setListings=${setListings} />
            <${ toggleSearch && AdvancedSearch} setToggleSearch=${setToggleSearch} setTotal=${setTotal} setListings=${setListings}/>
            <h3 class="result">Results found: ${total}</h3>
            <div class="properties">
                ${listings.length > 0 && listings.map((property) => html`
                    <div key=${property.id} class="property">
                        <h2 class="property-title">${property.street}</h2>
                        <p class="property-description">${property.description}</p>
                        <p class="property-location">
                            ${property.barangay}, ${property.municipality}, ${property.province} (${property.postal_code})
                        </p>
                    </div>
                `)}
            </div>
        </div>
    `;
};

render(html`<${publicClient} />`, document.getElementById('tierra-lista-embed'));
