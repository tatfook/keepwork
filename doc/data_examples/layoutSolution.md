# templates host location
http://git.keepwork.com/gitlab_rls_official/keepwork-template-v2

# new website select options
categories
## the name is critical for creating new website, don't update them
```javascript
[
  {
    "name": "Basic",
    "templates": [
      {
        "name": "Basic",
        "screenShot": "abcd.png",
        "previewUrl": "#暂时没有",
        "folder": "basic"
      },
      {
        "name": "Basic Fullscreen",
        "screenShot": "abcd.png",
        "previewUrl": "#暂时没有",
        "folder": "basic_fullscreen"
      }
    ]
  },
  {
    "name": "Header",
    "templates": [
      {
        "name": "Header",
        "screenShot": "abcd.png",
        "previewUrl": "#暂时没有",
        "folder": "header"
      },
      {
        "name": "Header Sidebar",
        "screenShot": "abcd.png",
        "previewUrl": "#暂时没有",
        "folder": "header_sidebar"
      }
    ]
  }
]

```

# default website _config/layout
layout
```javascript
{
  "layoutConfig": {
    "defaultLayoutId": 0,
    "layouts": [
      {
        "id": 0,
        "name": "Basic",
        "styleName": "basic",
        "match": "",
        "content": {
          "footer": "footer.md",
          "header": "header.md",
          "sidebar": "sidebar.md"
        }
      }
    ]
  },
  "pages": {
    "index.md": {
      "layout": 0
    }
  }
}

```