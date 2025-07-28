"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, Check as CheckIcon } from "@mui/icons-material";
import { LanguageDialogProps } from "@/types";
import menuData from "@/data/menu_mock.json";

/**
 * LanguageDialog component for changing menu language using mock JSON data
 * Provides multi-language support for the restaurant menu
 */
export const LanguageDialog: React.FC<LanguageDialogProps> = ({
  open,
  onClose,
  currentLanguage = "en",
  onLanguageChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange(languageCode);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
        }}
      >
        <Typography variant="h6">{menuData.dialogs.language.title}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {menuData.dialogs.language.subtitle}
        </Typography>

        <List>
          {menuData.dialogs.language.languages.map((language) => (
            <ListItem
              key={language.code}
              disablePadding
              sx={{
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemButton
                onClick={() => handleLanguageSelect(language.code)}
                selected={selectedLanguage === language.code}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Typography variant="h6" sx={{ minWidth: "auto" }}>
                    {language.flag}
                  </Typography>
                </ListItemIcon>
                <ListItemText
                  primary={language.name}
                  secondary={language.code.toUpperCase()}
                />
                {selectedLanguage === language.code && (
                  <CheckIcon color="inherit" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};
