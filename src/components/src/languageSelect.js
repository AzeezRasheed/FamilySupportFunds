import React from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import arrowDown from "./assets/svg/arrowDown.svg";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";

const languageMap = {
  en: { label: "English", dir: "ltr", active: true },
  // ar: { label: "العربية", dir: "ltr", active: false },
  pg: { label: "Português", dir: "ltr", active: false }
};

const LanguageSelect = () => {
 
  const selected = localStorage.getItem("i18nextLng");
  const forMatLang = selected.split('-')[0] || "en"
  const { t } = useTranslation();

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  React.useEffect(() => {

    document.body.dir = languageMap[forMatLang].dir;
  }, [menuAnchor, forMatLang]);

  return (
    <div className="d-flex justify-content-end align-items-center language-select-root">
      <Button onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}>
        {languageMap[forMatLang].label}
        <img className="ml-2" alt="p-icon" src={arrowDown} />
      </Button>
      <Popover
        open={!!menuAnchor}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <div>
          <List>
            <ListSubheader>{t("select_language")}</ListSubheader>
            {Object.keys(languageMap)?.map(item => (
              <ListItem
                button
                key={item}
                onClick={() => {
                  i18next.changeLanguage(item);
                  setMenuAnchor(null);
                }}
              >
                {languageMap[item]?.label}
              </ListItem>
            ))}
          </List>
        </div>
      </Popover>
    </div>
  );
};

export default LanguageSelect;
