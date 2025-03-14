import { ZOOM } from '@pdfme/common';
import { text } from '@pdfme/schemas';
import clientsService from "../../services/clients";
import i18next from 'i18next';

const createMergeTagData = async () => {
  const t = i18next.t.bind(i18next);
  let clientTags = {};
  try {
    const res = await clientsService.getFullformEmailPageData("&field_email_template=true");
    clientTags = res.data.result.client || {};
  } catch (error) {
    console.error("Error fetching client tags:", error);
  }

  return {
    request: {
      name: t("email_builder.requests"),
      mergeTags: {
        $request_id: {
          name: t("requests.$requestId"),
          value: "{request_id}",
        },
        $client_name: {
          name: t("requests.$clinetName"),
          value: "{client_name}",
        },
        $client_email: {
          name: t("requests.$clientEmail"),
          value: "{client_email}",
        },
        $domain_requested: {
          name: t("requests.$domainRequested"),
          value: "{domain_requested}",
        },
        $admin_email: {
          name: t("requests.$adminEmail"),
          value: "{admin_email}",
        },
      },
    },
    client: {
      name: t("email_builder.clients"),
      mergeTags: clientTags,
    },
    netfree_traffic: {
      name: t("email_builder.netfree_traffic"),
      mergeTags: {
        $traffic_recording_open_domain_pre_text: {
          name: t("email_builder.open_domain_pre_text"),
          value: "{traffic_recording_open_domain_pre_text}",
        },
        $traffic_recording_open_domain_list: {
          name: t("email_builder.open_domain_list"),
          value: "{traffic_recording_open_domain_list}",
        },
        $traffic_recording_open_domain_after_text: {
          name: t("email_builder.open_domain_after_text"),
          value: "{traffic_recording_open_domain_after_text}",
        },
        $traffic_recording_open_url_pre_text: {
          name: t("email_builder.open_url_pre_text"),
          value: "{traffic_recording_open_url_pre_text}",
        },
        $traffic_recording_open_url_list: {
          name: t("email_builder.open_url_list"),
          value: "{traffic_recording_open_url_list}",
        },
        $traffic_recording_open_url_after_text: {
          name: t("email_builder.open_url_after_text"),
          value: "{traffic_recording_open_url_after_text}",
        },
        $traffic_recording_blocked_pre_text: {
          name: t("email_builder.blocked_pre_text"),
          value: "{traffic_recording_blocked_pre_text}",
        },
        $traffic_recording_blocked_list: {
          name: t("email_builder.blocked_list"),
          value: "{traffic_recording_blocked_list}",
        },
        $traffic_recording_blocked_after_text: {
          name: t("email_builder.blocked_after_text"),
          value: "{traffic_recording_blocked_after_text}",
        },
        $traffic_recording_open_domain_temporary_pre_text: {
          name: t("email_builder.open_domain_temporary_pre_text"),
          value: "{traffic_recording_open_domain_temporary_pre_text}",
        },
        $traffic_recording_open_domain_temporary: {
          name: t("email_builder.open_domain_temporary"),
          value: "{traffic_recording_open_domain_temporary}",
        },
        $traffic_recording_open_domain_temporary_after_text: {
          name: t("email_builder.open_domain_temporary_after_text"),
          value: "{traffic_recording_open_domain_temporary_after_text}",
        },
        $traffic_recording_open_url_temporary_pre_text: {
          name: t("email_builder.open_url_temporary_pre_text"),
          value: "{traffic_recording_open_url_temporary_pre_text}",
        },
        $traffic_recording_open_url_temporary: {
          name: t("email_builder.open_url_temporary"),
          value: "{traffic_recording_open_url_temporary}",
        },
        $traffic_recording_open_url_temporary_after_text: {
          name: t("email_builder.open_url_temporary_after_text"),
          value: "{traffic_recording_open_url_temporary_after_text}",
        },
      },
    },
  };
};

const createDropdownMenu = (options, onChange, currentValue) => {
  const menuContainer = document.createElement('div');
  menuContainer.style.position = 'relative';
  menuContainer.style.width = '100%';
  menuContainer.style.zIndex = '9999';
  menuContainer.style.backgroundColor = '#fff';
  menuContainer.style.borderRadius = '4px';
  menuContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  menuContainer.style.fontSize = '16px';

  const button = document.createElement('button');
  button.textContent = '-- Select Merge Tag --';
  button.style.width = '100%';
  button.style.padding = '8px 12px';
  button.style.border = '1px solid #ddd';
  button.style.borderRadius = '4px';
  button.style.backgroundColor = '#fff';
  button.style.cursor = 'pointer';
  button.style.textAlign = 'left';
  button.style.position = 'relative';
  button.style.fontSize = '16px';
  button.style.lineHeight = '1.5';

  const menu = document.createElement('div');
  menu.style.position = 'absolute';
  menu.style.top = '100%';
  menu.style.left = '0';
  menu.style.width = '100%';
  menu.style.backgroundColor = '#fff';
  menu.style.border = '1px solid #ddd';
  menu.style.borderRadius = '4px';
  menu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  menu.style.display = 'none';
  menu.style.marginTop = '4px';
  menu.style.fontSize = '16px';

  Object.entries(options).forEach(([key, value]) => {
    const menuItem = document.createElement('div');
    menuItem.style.padding = '10px 12px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.position = 'relative';
    menuItem.textContent = value.name;
    menuItem.style.borderBottom = '1px solid #eee';
    menuItem.style.fontSize = '16px';
    menuItem.style.lineHeight = '1.5';

    const submenu = document.createElement('div');
    submenu.style.position = 'absolute';
    submenu.style.left = '100%';
    submenu.style.top = '0';
    submenu.style.backgroundColor = '#fff';
    submenu.style.border = '1px solid #ddd';
    submenu.style.borderRadius = '4px';
    submenu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    submenu.style.display = 'none';
    submenu.style.minWidth = '250px';
    submenu.style.zIndex = '10000';
    submenu.style.fontSize = '16px';

    Object.entries(value.mergeTags).forEach(([tagKey, tagValue]) => {
      const submenuItem = document.createElement('div');
      submenuItem.style.padding = '10px 12px';
      submenuItem.style.cursor = 'pointer';
      submenuItem.textContent = tagValue.name;
      submenuItem.style.borderBottom = '1px solid #eee';
      submenuItem.style.fontSize = '16px';
      submenuItem.style.lineHeight = '1.5';

      submenuItem.addEventListener('mouseenter', () => {
        submenuItem.style.backgroundColor = '#f5f5f5';
      });

      submenuItem.addEventListener('mouseleave', () => {
        submenuItem.style.backgroundColor = '#fff';
      });

      submenuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        onChange && onChange({ key: 'content', value: tagValue.value });
        button.textContent = tagValue.name;
        menu.style.display = 'none';
        if (currentValue === tagValue.value) {
          submenuItem.style.backgroundColor = '#e6f7ff';
        }
      });

      submenu.appendChild(submenuItem);
    });

    menuItem.addEventListener('mouseenter', () => {
      menuItem.style.backgroundColor = '#f5f5f5';
      const allSubmenus = menu.querySelectorAll('[data-submenu]');
      allSubmenus.forEach(sm => sm.style.display = 'none');
      submenu.style.display = 'block';
    });

    menuItem.addEventListener('mouseleave', () => {
      menuItem.style.backgroundColor = '#fff';
    });

    menuItem.appendChild(submenu);
    submenu.setAttribute('data-submenu', '');
    menu.appendChild(menuItem);
  });

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  });

  // Close menu when clicking outside
  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });

  menuContainer.appendChild(button);
  menuContainer.appendChild(menu);

  // Stop propagation of all mouse events
  ['mousedown', 'mouseup', 'click'].forEach(eventName => {
    menuContainer.addEventListener(eventName, (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  });

  return menuContainer;
};

export const mergetag = {
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode } = arg;
    
    if (mode === 'viewer' || (mode === 'form' && schema.readOnly)) {
      const textElement = document.createElement('div');
      textElement.textContent = value || '';
      textElement.style.fontSize = '16px';
      textElement.style.lineHeight = '1.5';
      rootElement.appendChild(textElement);
      return;
    }

    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.padding = '4px';
    container.style.position = 'relative';
    container.style.zIndex = '9999';

    const mergeTagData = await createMergeTagData();
    const dropdownMenu = createDropdownMenu(mergeTagData, onChange, value);
    container.appendChild(dropdownMenu);
    rootElement.appendChild(container);

    // Set initial value if exists
    if (value) {
      Object.entries(mergeTagData).forEach(([category, categoryData]) => {
        Object.entries(categoryData.mergeTags).forEach(([tagKey, tagData]) => {
          if (tagData.value === value) {
            const button = dropdownMenu.querySelector('button');
            if (button) {
              button.textContent = tagData.name;
            }
          }
        });
      });
    }
  },
  pdf: text.pdf,
  propPanel: {
    schema: {},
    defaultSchema: {
      name: '',
      type: 'mergetag',
      content: '',
      position: { x: 0, y: 0 },
      width: 100,
      height: 20,
    },
  },
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 12h6"></path><path d="M9 16h6"></path></svg>',
};