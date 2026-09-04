<?php

namespace App\Enums;

enum Permission: string
{
    // Menus (web sidebar, shared contract for web & mobile)
    case MenuPackages = 'menu.packages';
    case MenuBags = 'menu.bags';
    case MenuBatches = 'menu.batches';
    case MenuReports = 'menu.reports';
    case MenuSettingsRoles = 'menu.settings.roles';
    case MenuSettingsRates = 'menu.settings.rates';
    case MenuSettingsIrregularity = 'menu.settings.irregularity';
    case MenuSettingsPayments = 'menu.settings.payments';
    case MenuProfile = 'menu.profile';

    // Package actions
    case ActionPackagesCreate = 'action.packages.create';
    case ActionPackagesProcess = 'action.packages.process';

    // Bag actions
    case ActionBagsPrint = 'action.bags.print';
    case ActionBagsAdjust = 'action.bags.adjust';

    // Batch actions
    case ActionBatchesPrint = 'action.batches.print';
    case ActionBatchesSchedule = 'action.batches.schedule';

    // Cross-entity
    case SettingsManage = 'settings.manage';
    case ReportsView = 'reports.view';

    // Promo
    case PromotionsManage = 'promotions.manage';
    case PromoCodesManage = 'promo-codes.manage';
}
