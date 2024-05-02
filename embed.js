import { html, render, useState, useEffect } from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

document.querySelector("body").innerHTML += "<div id='tierra-lista-embed'></div>";

const Styles = () => {
    return html`
        <style>
            .tierra-lista-container {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
            }

            .tierra-lista-container {
                margin: 0 auto;
                padding: 1rem;
                max-width: 900px;
            }

            .tierra-lista-container .title {
                font-size: 2rem;
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
            }


            .tierra-lista-container .form-row > .form-input {
                margin-right: 1rem;
            }

            .tierra-lista-container .form-select,
            .tierra-lista-container .form-input {
                border: 1px solid #ccc;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                outline: none;
                margin: 0.25rem;
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
            .tierra-lista-container .form-button-remove {
                border-radius: 0;
                margin-left: -1px;
            }

            .tierra-lista-container .form-button-remove {
                background-color: #bf1f1f;
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
                width:25%;
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
        </style>
    `;
};

const BasicSearch = ({ setTotal, setListings }) => {
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
                <button
                    type="submit"
                    class="form-button form-button-submit"
                >
                    Search Property
                </button>
        </form>
    `;
};

const AdvancedSearch = ({ setTotal, setListings }) => {
    const [filterRows, setFilterRows] = useState([{match:'all', filter: {field: 'Province', operator: 'is', value: '' }}]);
    console.log(filterRows)
    const advancedRow = ({row, index }) => {
        return html`
            <div key=${index} class="form-row">
                <select
                    class="form-select"
                    value=${row.field}
                    name="field"
                    onChange=${(e) => handleFieldChange(index, e.target.name, e.target.value)}
                >
                    <option value="Province">Province</option>
                    <option value="Municipality">Municipality</option>
                    <option value="Barangay">Barangay</option>
                    <option value="Street">Street</option>
                </select>
                <select
                    class="form-select"
                    value=${row.operator}
                    name="operator"
                    onChange=${(e) => handleFieldChange(index, e.target.name, e.target.value)}
                >
                    <option value="is">is</option>
                </select>
                <input
                    class="form-input"
                    value=${row.value}
                    name="value"
                    onChange=${(e) => handleFieldChange(index, e.target.name, e.target.value)}
                />
                <button
                    type="button"
                    onClick=${handleAddRow}
                    class="form-button form-button-add"
                >
                    And
                </button>
                <button
                        type="button"
                        onClick=${() => handleRemoveRow(index)}
                        class="form-button form-button-remove"
                    >
                        Remove
                </button>
                
            </div>
        `
    }

    const handleAddRow = () => {
        setFilterRows([...filterRows, {match:'all', filter: {field: 'Province', operator: 'is', value: '' }}]);
    };

    const handleOrRow = () => {
        setFilterRows([...filterRows, {match:'any', filter: {field: 'Province', operator: 'is', value: '' }}]);
    };


    const handleRemoveRow = (index) => {
        const updatedRows = filterRows.filter((_, idx) => idx !== index);
        setFilterRows(updatedRows);
    };

    const handleFieldChange = (index, selectedField, selectedFieldValue) => {
        const updatedRows = [...filterRows];
        updatedRows[index][selectedField] = selectedFieldValue;
        setFilterRows(updatedRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(filterRows)
        try {
            const res = await fetch('https://api.presylord.com/v1/properties?action=advancedSearch', {
                method: 'POST',
                body: JSON.stringify({
                    advancedSearch: filterRows
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
            <div class="form-row">
                <p>
                    <span>Match</span>
                    <select class="form-select" value="" name="all_any">
                        <option value="all">all</option>
                        <option value="any">any</option>
                    </select>
                    <span> of the following rules </span>
                    ${filterRows.length == 0 && html`<button
                        type="button"
                        onClick=${handleAddRow}
                        class="form-button form-button-add"
                    >
                        Add Rule
                    </button>`}
                </p>
            </div>
            <div class="advancedSearch">
                ${filterRows.map((row, index) => html`
                    <${advancedRow} row=${row} index=${index}/>
                `)}
                <!-- Modify advanced Row for Or Row -->
            </div>
            <div class="form-submit">
                <button
                    type="submit"
                    class="form-button form-button-submit"
                >
                    Search Property
                </button>
            </div>
        </form>
    `;
};

const publicClient = () => {
    const [listings, setListings] = useState([]);
    const [total, setTotal] = useState(0);

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
            <${BasicSearch} setTotal=${setTotal} setListings=${setListings} />
            <${AdvancedSearch} setTotal=${setTotal} setListings=${setListings}/>
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
