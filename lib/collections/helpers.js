// input decides if it will show up in a form
// key is the unique identifier for each indicator
// label is what's shown on a form
export const indicators = [{
    key: 'bap',
    label: "Investigators Baptized",
}, {
    key: 'conf',
    label: "Investigators Confirmed",
}, {
    key: 'wd',
    label: "Investigators with a baptismal date",
}, {
    key: 'atsac',
    label: "Investigators who attended sacrament meeting",
}, {
    key: 'mp',
    label: "Lessons taught with a member present",
}, {
    key: 'ol',
    label: "Other lessons taught",
}, {
    key: 'pi',
    label: "Progressing investigators",
}, {
    key: 'refr',
    label: "Referrals recieved",
}, {
    key: 'refc',
    label: "Referrals contacted",
}, {
    key: 'ni',
    label: "New Investigators",
}, {
    key: 'larc',
    label: "Lessons taught to recent converts and less-active members",
}, {
    key: 'qual',
    label: "Quality lessons",
}, {
    key: 'dwm',
    label: "DWM lessons",
}, {
    key: 'fol',
    label: "DWM follow up",
}, {
    key: 'niM',
    label: "New investigators found through members",
}, {
    key: 'niFTM',
    input: false
}, {
    key: 'bapM',
    label: "Baptisms found through members",
}, {
    key: 'bapFTM',
    input: false
}];

// validation and transformation
// key is a must
// default for input is true, unless set otherwise
// if input is set to true, then it must have a label
for (i in indicators){
    let ki = indicators[i];
    if (!ki.key){
        throw new Error("Indicator at position ["+i+"] does not have a key.")
    }
    if (ki.input === undefined){
        ki.input = true;
    }
    if (ki.input && ki.label === undefined){
        throw new Error("Indicator ["+ki.key+"] must have a label if input is true")
    }
}