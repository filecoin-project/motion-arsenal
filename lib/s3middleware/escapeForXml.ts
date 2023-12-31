/**
* Project: node-xml https://github.com/dylang/node-xml
* License: MIT https://github.com/dylang/node-xml/blob/master/LICENSE
*/
const XML_CHARACTER_MAP = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
};

export default function escapeForXml(string: string) {
    return string && string.replace
        ? string.replace(/([&"<>'])/g, (str, item) => XML_CHARACTER_MAP[item])
        : string;
}
