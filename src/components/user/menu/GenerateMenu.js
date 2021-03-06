import React, {useContext} from "react";
import {menuDisplayStrings} from "../../../resources/UserDisplayStrings";
import {LocaleContext} from "../../../context/LocaleContext";
import InputGroup from "../../commons/elements/form/InputGroup";

const GenerateMenu = (props) => {
    // Localizations
    menuDisplayStrings.setLanguage(useContext(LocaleContext));

    return (
        <section>
            <div className="section-content">
                <label>{menuDisplayStrings.menuDishAmountLabel}
                    <select value={props.recipeCount} onChange={e => props.setRecipeCount(e.target.value)}>
                        <option value={3}>3 {menuDisplayStrings.menuDishes}</option>
                        <option value={4}>4 {menuDisplayStrings.menuDishes}</option>
                        <option value={5}>5 {menuDisplayStrings.menuDishes}</option>
                        <option value={6}>6 {menuDisplayStrings.menuDishes}</option>
                    </select>
                </label>
                <InputGroup>
                    <button className="button-light" onClick={props.generate}>
                        {menuDisplayStrings.menuGenerate}
                    </button>
                    {props.isMenuLoaded && <>
                        {props.isMenuNew ? <>
                            <button className="button-light" onClick={props.load}>{menuDisplayStrings.menuLoad}</button>
                            <button className="button-dark" onClick={props.save}>{menuDisplayStrings.menuSave}</button>
                        </> : <>
                            <button className="button-light" disabled>{menuDisplayStrings.menuCurrentlyShowing}</button>
                            <button className="button-dark" disabled>{menuDisplayStrings.menuAlreadySaved}</button>
                        </>}
                    </>}
                </InputGroup>
            </div>
        </section>
    )
}

export default GenerateMenu;